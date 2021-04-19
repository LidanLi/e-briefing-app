import {Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {EventsProvider} from "@providers/events/events";
import {ContactPage} from "@pages/contact/contact";
import {DocumentsProvider} from "@providers/documents/documents";
import {DocumentViewer} from "@ionic-native/document-viewer";
import {GlobalsProvider} from "@providers/globals/globals";
import {FileOpener} from "@ionic-native/file-opener";

@Component({
    selector: 'page-event',
    templateUrl: 'event.html',
})
export class EventPage {

    public event: any;
    public selected_document: any;

    constructor(public navCtrl: NavController, public navParams: NavParams, private eventsProvider: EventsProvider, private documentsProvider: DocumentsProvider, private document: DocumentViewer, private globals: GlobalsProvider, private fileOpener: FileOpener) {
        this.loadEvent();
    }

    loadEvent() {
        this.eventsProvider.get(this.navParams.get('event'))
            .then(data => {
                this.event = data;
            });
    }

    showDocument(id) {
        var options = {
            title: 'PDF'
        }

        this.documentsProvider.get(id)
            .then(data => {
                this.selected_document = data;
              let fileExtn = this.selected_document.file.split('.').reverse()[0];
              let fileMIMEType = this.getMIMEtype(fileExtn);
                //this.document.viewDocument(this.globals.dataDirectory + 'data/assets/' + this.selected_document.file, 'application/pdf', options);

              this.fileOpener.open(this.globals.dataDirectory + 'data/assets/' + this.selected_document.file, fileMIMEType)
                .then(()=> console.log('File is opened'))
                .catch(e => console.log('Error opening file', e));
            });
    }

    showPerson(id) {
        this.navCtrl.push(ContactPage, {
            contact: id
        });
    }

  getMIMEtype(extn){
    let ext = extn.toLocaleLowerCase();
    let MIMETypes = {
      'pdf' : 'application/pdf',
      'docx':'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'doc' : 'application/msword',
      'xls' : 'application/vnd.ms-excel',
      'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'ppt' : 'application/vnd.ms-powerpoint',
      'pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
    }
    return MIMETypes[ext];
  }
}
