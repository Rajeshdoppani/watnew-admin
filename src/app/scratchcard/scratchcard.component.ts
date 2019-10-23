import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ScratchcardService } from 'app/services/scratchcard.service';
declare var $: any;

@Component({
  selector: 'app-scratchcard',
  templateUrl: './scratchcard.component.html',
  styleUrls: ['./scratchcard.component.css']
})
export class ScratchcardComponent implements OnInit {

  errorMessage: string;
  successMessage: string;

  cardsStatusForm: FormGroup;
  cardDetailsForm: FormGroup;

  cardsStatusLists = [
    { value: 'issued', type: 'Issued' },
    { value: 'redeemed', type: 'Redeemed' },
    { value: 'scratched', type: 'Scratched' },
    { value: 'expired', type: 'Expired' }
  ];

  // Displayd Column Name/Id's //
  displayedColumns = ['sno', 'nick_name', 'mobile', 'amount', 'issued_date', 'expire_date', 'redeemed_date', 'scrach_status', 'actions'];
  dataSource: MatTableDataSource<scratchListResp>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  // Applying Filter for Employees Search //
  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  constructor(private scratchService: ScratchcardService, private formBuilder: FormBuilder) {
    // Card Status Form Controls //
    this.cardsStatusForm = this.formBuilder.group({
      status: ['', Validators.required]
    });

    // View Card Details Form Controls //
    this.cardDetailsForm = this.formBuilder.group({
      id: [{ value: '', disabled: true }, Validators.required],
      amount: [{ value: '', disabled: true }, Validators.required],
      expire_date: [{ value: '', disabled: true }, Validators.required],
      issued_date: [{ value: '', disabled: true }, Validators.required],
      mobile: [{ value: '', disabled: true }, Validators.required],
      nick_name: [{ value: '', disabled: true }, Validators.required],
      redeemed_date: [{ value: '', disabled: true }, Validators.required],
      scrach_status: [{ value: '', disabled: true }, Validators.required],
      type: [{ value: '', disabled: true }, Validators.required]
    });

    // Get All User Scratch Cards Function Invoking //
    this.getAllUsersScratechCards();
  }

  // Get All User Scratch Cards Function //
  getAllUsersScratechCards() {
    this.cardsStatusForm.reset();
    this.scratchService.getAllUsersScratechCards().subscribe(resp => {
      if (resp.status == 'success' && resp.status_code == 200) {
        this.dataSource = new MatTableDataSource(resp.data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
      else {
        this.errorMessage = resp.message;
        $('#errorMessageModal').modal('show');
      }
    });
  };

  // Get All User Scratch Cards Based On Scratch Status Function //
  onCardsStatusChange(status: string) {
    if (status) {
      let formData = new FormData();
      formData.append('search', status);
      this.scratchService.getAllUsersScratechCardsBySearch(formData).subscribe(resp => {
        if (resp.status == 'success' && resp.status_code == 200) {
          this.dataSource = new MatTableDataSource(resp.data);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        }
        else {
          this.errorMessage = resp.message;
          $('#errorMessageModal').modal('show');
        }
      });
    }
  }

  // View Scratch Card Details Function //
  viewScratchCardDetails(row: any) {
    this.cardDetailsForm.setValue({
      id: row.id,
      amount: row.amount,
      expire_date: row.expire_date,
      issued_date: row.issued_date,
      mobile: row.mobile,
      nick_name: row.nick_name,
      redeemed_date: row.redeemed_date,
      scrach_status: row.scrach_status,
      type: row.type
    });
    $('#viewScratchCardModal').modal('show');
  }

  ngOnInit() {
  }

}

declare interface scratchListResp {
  id: number;
  amount: number;
  expire_date: string;
  issued_date: string;
  mobile: string;
  nick_name: string;
  redeemed_date: string;
  scrach_status: string;
  type: string;
}