import { Component, OnInit } from '@angular/core';
import { DataSource } from '@angular/cdk/collections';
import { ApiService } from 'src/app/services/api.service';
import * as jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-book',
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.css']
})
export class BookComponent implements OnInit {

  books: any;
  displayedColumns = ['isbn', 'title', 'author'];
  dataSource = new BookDataSource(this.api);

  constructor(private api: ApiService) { }

  ngOnInit() {
    this.api.getBooks()
      .subscribe(res => {
        console.log(res);
        this.books = res;
      }, err => {
        console.log(err);
      });
  }

  generarPDF(){
    html2canvas(document.getElementById('books'), {
      allowTaint: true,
      useCORS: false,
      scale: 1
    }).then(function(canvas) {
      var img = canvas.toDataURL("image/png");
      var doc = new jsPDF({
        unit:'pt',
        format:'letter'});
        doc.text("Listado de libros", 200, 70, { align: "left" })
        
        doc.setFontSize(90);
      doc.addImage(img,'PNG', 150, 150, 500, 200);
      doc.save('books.pdf');
      
    });
  }

  exportAsXLSX(): void {
    this.api.exportAsExcelFile(this.books, 'Books');
  }
}

export class BookDataSource extends DataSource<any> {
  constructor(private api: ApiService) {
    super()
  }

  connect() { return this.api.getBooks(); }

  disconnect() { }
}

