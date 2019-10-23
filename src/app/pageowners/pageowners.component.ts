import { Component, OnInit, ViewChild } from '@angular/core';
import { UsersService } from 'app/services/users.service';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PagesService } from 'app/services/pages.service';
declare var $: any;

@Component({
  selector: 'app-pageowners',
  templateUrl: './pageowners.component.html',
  styleUrls: ['./pageowners.component.css']
})
export class PageownersComponent implements OnInit {

  pageOwnerDetailsForm: FormGroup;
  pageDetailsForm: FormGroup;
  pageOwnersList: any[];
  errorMessage: string;
  successMessage: string;
  pageOwnerId: string;

  statusList = [
    { id: 1, name: 'Enable' },
    { id: 0, name: 'Disable' }
  ];

  // Files Info //
  updateCoverPhoto: File = null;
  updatePageIcon: File = null;

  // Displayd Column Name/Id's //
  displayedColumns = ['sno', 'nick_name', 'email', 'mobile', 'source_type', 'page_title', 'created_at', 'actions'];
  dataSource: MatTableDataSource<pageOwnersListResp>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  // Applying Filter for Employees Search //
  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  constructor(private formBuilder: FormBuilder, private usersService: UsersService, private pagesService: PagesService) {

    // Page Owner Details Form Controls //
    this.pageOwnerDetailsForm = this.formBuilder.group({
      id: [{ value: '', disabled: true }, Validators.required],
      nick_name: [{ value: '', disabled: true }, Validators.required],
      email: [{ value: '', disabled: true }, Validators.required],
      mobile: [{ value: '', disabled: true }, Validators.required],
      created_at: [{ value: '', disabled: true }, Validators.required],
      updated_at: [{ value: '', disabled: true }, Validators.required],
      source_type: [{ value: '', disabled: true }, Validators.required]
    });

    // Page Details Form Controls //
    this.pageDetailsForm = this.formBuilder.group({
      id: [{ value: '', disabled: true }, Validators.required],
      name: ['', Validators.required],
      about: ['', Validators.required],
      category_id: [{ value: '', disabled: true }, Validators.required],
      status: ['', Validators.required],
      page_icon: [{ value: '', disabled: true }, Validators.required],
      page_header: [{ value: '', disabled: true }, Validators.required],
      created_at: [{ value: '', disabled: true }, Validators.required],
      updated_at: [{ value: '', disabled: true }, Validators.required]
    });

    // Get Page Owners Function Invoking //
    this.getPageOwners();
  }

  // Get Page Owners Function //
  getPageOwners(): void {
    this.usersService.getPageOwners().subscribe(resp => {
      if (resp.status == 'success' && resp.status_code == 200) {
        this.dataSource = new MatTableDataSource(resp.data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
      else {
        this.dataSource = new MatTableDataSource([]);
        this.errorMessage = 'Failed to list page owners. Please reload...!!!';
        $('#errorMessageModal').modal('show');
      }
    });
  }

  // View Page Owner Details Function //
  viewPageOwnerDetails(row: any): void {
    this.pageOwnerDetailsForm.setValue({
      id: row.id,
      nick_name: row.nick_name,
      email: row.email,
      mobile: row.mobile,
      created_at: row.created_at,
      updated_at: row.updated_at,
      source_type: row.source_type,
    });
    $('#viewPageOwnerDetailsModal').modal('show');
  }

  // View Page Details Function //
  viewPageDetails(row: any): void {
    (<HTMLInputElement>document.getElementById('updateCoverPhotoID')).value = '';
    (<HTMLInputElement>document.getElementById('updatePageIconID')).value = '';
    this.pageDetailsForm.setValue({
      id: row.pages[0].id,
      name: row.pages[0].name,
      about: row.pages[0].about,
      status: row.pages[0].status,
      category_id: row.pages[0].category_id,
      page_icon: row.pages[0].page_icon,
      page_header: row.pages[0].page_header,
      created_at: row.pages[0].created_at,
      updated_at: row.pages[0].updated_at
    });
    $('#viewPageDetailsModal').modal('show');
  }

  // Functions to Handling the File Input On Select @Update of Owner Post //
  coverPhotoAtUpdate(files: FileList) {
    this.updateCoverPhoto = null;
    this.updateCoverPhoto = files.item(0);
  }
  pageIconAtUpdate(files: FileList) {
    this.updatePageIcon = null;
    this.updatePageIcon = files.item(0);
  }

  // Update Page Details Function //
  updatePageDetails(): void {
    $('#viewPageDetailsModal').modal('hide');
    let formData = new FormData();
    formData.append('id', this.pageDetailsForm.controls['id'].value);
    formData.append('name', this.pageDetailsForm.controls['name'].value);
    formData.append('about', this.pageDetailsForm.controls['about'].value);
    formData.append('category_id', this.pageDetailsForm.controls['category_id'].value);
    formData.append('status', this.pageDetailsForm.controls['status'].value);
    if (this.updatePageIcon == null) {
      formData.append('page_icon', '');
    }
    else {
      formData.append('page_icon', this.updatePageIcon);
    }
    if (this.updateCoverPhoto == null) {
      formData.append('page_header', '');
    }
    else {
      formData.append('page_icon', this.updateCoverPhoto);
    }
    this.pagesService.updateOwnerPageDetails(formData).subscribe(resp => {
      if (resp.status == 'success' && resp.status_code == 200) {
        this.successMessage = 'Page details updated successfully.';
        $('#successMessageModal').modal('show');
        this.getPageOwners();
      }
      else {
        this.errorMessage = resp.message;
        $('#errorMessageModal').modal('show');
      }
    });
  }

  // Prompt Delete Page Owner Post //
  confirmDeletePage() {
    $('#viewPageDetailsModal').modal('hide');
    $('#confirmDeleteModal').modal('show');
  }

  // Confirm Delete Owner Page Function //
  deleteOwnerPage() {
    $('#confirmDeleteModal').modal('hide');
    let formDate = new FormData();
    formDate.append('page_id', this.pageDetailsForm.controls['id'].value);
    this.pagesService.deleteOwnerPage(formDate).subscribe(resp => {
      if (resp.status == 'success' && resp.status_code == 200) {
        this.successMessage = 'Page deleted successfully.';
        $('#successMessageModal').modal('show');
        this.getPageOwners();
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

export interface pageOwnersListResp {
  id: string;
  nick_name: string;
  email: string;
  mobile: string;
  created_at: string;
  updated_at: string;
  source_type: string;
}
