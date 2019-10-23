import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { EnquiriesService } from 'app/services/enquiries.service';
declare var $: any;

@Component({
  selector: 'app-enquiries',
  templateUrl: './enquiries.component.html',
  styleUrls: ['./enquiries.component.css']
})
export class EnquiriesComponent implements OnInit {

  errorMessage: string;
  successMessage: string;
  enquiryDetailsForm: FormGroup;

  // Displayd Column Name/Id's //
  displayedColumns = ['sno', 'user_name', 'mobile', 'post_title', 'message', 'created_at', 'actions'];
  dataSource: MatTableDataSource<enquiriesListResp>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  // Applying Filter for Employees Search //
  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  constructor(private enquiriesService: EnquiriesService, private formBuilder: FormBuilder) {

    // Enquiry Details Form Controls //
    this.enquiryDetailsForm = this.formBuilder.group({
      id: [{ value: '', disabled: true }],
      user_name: [{ value: '', disabled: true }],
      mobile: [{ value: '', disabled: true }],
      post_title: [{ value: '', disabled: true }],
      message: [{ value: '', disabled: true }],
      created_at: [{ value: '', disabled: true }],
      updated_at: [{ value: '', disabled: true }]
    });

    // Get All Enquiries Function Invoking //
    this.getAllEnquiries();
  }

  // Get All Enquiries Function //
  getAllEnquiries(): void {
    this.enquiriesService.getAllEnquiries().subscribe(resp => {
      if (resp.status == 'success' && resp.status_code == 200) {
        this.dataSource = new MatTableDataSource(resp.data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
      else {
        this.errorMessage = 'Failed to list enquiries. Please reload...!!!';
        $('#errorMessageModal').modal('show');
      }
    });
  }

  // View Enquiry Details Function //
  viewEnquiryDetails(row: any): void {
    this.enquiryDetailsForm.setValue({
      id: row.id,
      user_name: row.user_name,
      mobile: row.mobile,
      post_title: row.post_title,
      message: row.message,
      created_at: row.created_at,
      updated_at: row.updated_at
    });
    $('#viewEnquiryDetailsModal').modal('show');
  }

  // Prompt Delete Enquiry Function //
  confirmDeleteEnquiry(row: any) {}

  ngOnInit() {
  }

}

export interface enquiriesListResp {
  id: string;
  mobile: string;
  message: string;
  created_at: string;
  updated_at: string;
}
