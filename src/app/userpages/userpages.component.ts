import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { PagesService } from 'app/services/pages.service';
declare var $: any;

@Component({
  selector: 'app-userpages',
  templateUrl: './userpages.component.html',
  styleUrls: ['./userpages.component.css']
})
export class UserpagesComponent implements OnInit {

  successMessage: string;
  errorMessage: string;
  pageId: string;
  pageDetailsForm: FormGroup;

  // Files Info //
  coverPhotoFile: File = null;
  pageIconFile: File = null;

  statusList = [
    { id: 1, name: 'Enable' },
    { id: 0, name: 'Disable' }
  ];

  inHomePageList = [
    { id: 1, name: 'Yes' },
    { id: 0, name: 'No' }
  ];

  // Displayd Column Name/Id's //
  displayedColumns = ['sno', 'name', 'page_icon', 'page_header', 'status', 'comments', 'courtesy', 'homepage', 'default_follow', 'actions'];
  dataSource: MatTableDataSource<pagesListResp>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  // Applying Filter for Employees Search //
  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  constructor(private pagesService: PagesService, private formBuilder: FormBuilder) {
    // View Page Details Form Controls //
    this.pageDetailsForm = this.formBuilder.group({
      'id': ['', Validators.required],
      'category_id': ['', Validators.required],
      'name': ['', Validators.required],
      'about': ['', Validators.required],
      'show_in_homepage': ['', Validators.required],
      'status': ['', Validators.required],
      'page_header': ['', Validators.required],
      'page_icon': ['', Validators.required]
    });

    // Get All Pages Function Invoking //
    this.getAllPages();
  }

  // Get All Pages Function //
  getAllPages(): void {
    this.pagesService.getAllPages().subscribe(resp => {
      if (resp.status == 'success' && resp.status_code == 200) {
        this.dataSource = new MatTableDataSource(resp.data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
      else {
        this.errorMessage = 'Failed to list pages. Please reload...!!!';
        $('#errorMessageModal').modal('show');
      }
    });
  }

  // View Page Details Function //
  viewPageDetails(row: any): void {
    this.pageDetailsForm.setValue({
      id: row.id,
      name: row.name,
      about: row.about,
      show_in_homepage: row.show_in_homepage,
      status: row.status,
      page_header: row.page_header,
      page_icon: row.page_icon,
      category_id: row.category_id
    });
    (<HTMLInputElement>document.getElementById('coverPhotoFileId')).value = '';
    (<HTMLInputElement>document.getElementById('pageIconFileId')).value = '';
    $('#viewPageDetailsModal').modal('show');
  }

  // Function to Handling the File Input On Select @Creation of Category //
  pageIconFileInput(files: FileList) {
    this.pageIconFile = null;
    this.pageIconFile = files.item(0);
  }

  coverPhotoFileInput(files: FileList) {
    this.coverPhotoFile = null;
    this.coverPhotoFile = files.item(0);
  }

  // Update Page Details Function //
  updatePageDetails(): void {
    $('#viewPageDetailsModal').modal('hide');
    let formData = new FormData();
    formData.append('id', this.pageDetailsForm.controls['id'].value);
    formData.append('category_id', this.pageDetailsForm.controls['category_id'].value);
    formData.append('name', this.pageDetailsForm.controls['name'].value);
    formData.append('about', this.pageDetailsForm.controls['about'].value);
    formData.append('status', this.pageDetailsForm.controls['status'].value);
    formData.append('show_in_homepage', this.pageDetailsForm.controls['show_in_homepage'].value);
    if (this.pageIconFile !== null) {
      formData.append('page_icon', this.pageIconFile);
    }
    if (this.coverPhotoFile !== null) {
      formData.append('page_header', this.coverPhotoFile);
    }
    this.pagesService.updatePageDetails(formData).subscribe(resp => {
      if (resp.status == 'success' && resp.status_code == 200) {
        // Calling All Pages Function //
        this.getAllPages();
        this.successMessage = 'Page details updated successfully.';
        $('#successMessageModal').modal('show');
      }
      else {
        this.errorMessage = resp.message;
        $('#errorMessageModal').modal('show');
      }
    });
  }

  // Enable or disable page comments Function //
  enableOrDisableComments(id: any, status: string): void {
    status = status == 'false' ? 'true' : 'false';
    let formData = new FormData();
    formData.append('comment_status', status);
    formData.append('page_id', id);
    this.pagesService.enableOrDisableComments(formData).subscribe(resp => {
      if (resp.status == 'success' && resp.status_code == 200) {
        this.successMessage = resp.message;
        $('#successMessageModal').modal('show');
        this.getAllPages();
      }
      else {
        this.errorMessage = resp.message;
        $('#errorMessageModal').modal('show');
      }
    });
  }

  // Enable or Disable Courtesy Function //
  enableOrDisableCourtesy(id: any, status: string): void {
    status = status == 'false' ? 'true' : 'false';
    let formData = new FormData();
    formData.append('courtesy_status', status);
    formData.append('page_id', id);
    this.pagesService.enableOrDisableCourtesy(formData).subscribe(resp => {
      if (resp.status == 'success' && resp.status_code == 200) {
        this.successMessage = resp.message;
        $('#successMessageModal').modal('show');
        this.getAllPages();
      }
      else {
        this.errorMessage = resp.message;
        $('#errorMessageModal').modal('show');
      }
    });
  }

  // Make as Default Follow Function //
  makeAsDefaultPage(id: any, asDefault: string): void {
    asDefault = asDefault == '0' ? '1' : '0';
    let formData = new FormData();
    formData.append('default_follow', asDefault);
    formData.append('page_id', id);
    this.pagesService.makeAsDefaultPage(formData).subscribe(resp => {
      if (resp.status == 'success' && resp.status_code == 200) {
        this.successMessage = resp.message;
        $('#successMessageModal').modal('show');
        this.getAllPages();
      }
      else {
        this.errorMessage = resp.message;
        $('#errorMessageModal').modal('show');
      }
    });
  }

  // Prompt Delete Page Function //
  confirmPageDelete(row: any): void {
    this.pageId = row.id;
    $('#confirmDeleteModal').modal('show');
  }

  // Delete Page Function //
  deletePage(): void {
    $('#confirmDeleteModal').modal('hide');
    let formDate = new FormData();
    formDate.append('page_id', this.pageId);
    this.pagesService.deleteOwnerPage(formDate).subscribe(resp => {
      if (resp.status == 'success' && resp.status_code == 200) {
        this.successMessage = 'Page deleted successfully.';
        $('#successMessageModal').modal('show');
        this.getAllPages();
      }
      else {
        this.errorMessage = resp.message;
        $('#errorMessageModal').modal('show');
      }
    });
  }

  ngOnInit() {
  }

}

export interface pagesListResp {
  id: string;
  name: string;
  page_icon: string;
  page_header: string;
  status: string;
  comments: string;
  courtesy: string;
  default_follow: string;
  show_in_homepage: string;
  category_id: string;
  about: string;
}

