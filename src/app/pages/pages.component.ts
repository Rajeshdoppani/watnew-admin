import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { PagesService } from 'app/services/pages.service';
import { DashboardService } from 'app/services/dashboard.service';
import { CategoryService } from 'app/services/category.service';
declare var $: any;

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.css']
})
export class PagesComponent implements OnInit {

  successMessage: string;
  errorMessage: string;
  pageId: string;
  pageDetailsForm: FormGroup;
  fetchPagesForm: FormGroup;
  categoryData: any[];
  subCategoryData: any[];

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
  displayedColumns = ['sno', 'name', 'page_icon', 'page_header', 'status', 'comments', 'courtesy', 'homepage', 'is_celebrity', 'actions'];
  dataSource: MatTableDataSource<pagesListResp>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  // Applying Filter for Employees Search //
  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  constructor(private pagesService: PagesService, private dashboardService: DashboardService, private categoryService: CategoryService, private formBuilder: FormBuilder) {

    // Fetch Pages Form Controls //
    this.fetchPagesForm = this.formBuilder.group({
      'category_id': ['', Validators.required],
      'subcategory_id': ['', Validators.required]
    });

    // View Page Details Form Controls //
    this.pageDetailsForm = this.formBuilder.group({
      'id': ['', Validators.required],
      'category_id': ['', Validators.required],
      'name': ['', Validators.required],
      'about': ['', Validators.required],
      'show_in_homepage': ['', Validators.required],
      'status': ['', Validators.required],
      'page_header': ['', Validators.required],
      'page_icon': ['', Validators.required],
      'meta_title': ['', Validators.required],
      'meta_description': ['', Validators.required],
      'meta_keywords': ['', Validators.required]
    });

    // Get All Categories Function Invoking //
    this.getAllCategories();

    // Get All Pages Function Invoking //
    this.getAllPages();
  }

  // Get All Categories Function //
  getAllCategories(): void {
    this.categoryService.getAllCategories().subscribe(resp => {
      if (resp.status == 'success' && resp.status_code == 200) {
        this.categoryData = resp.data;
      }
      else {
        this.errorMessage = 'Failed to list categories. Please reload...!!!';
        $('#errorMessageModal').modal('show');
      }
    });
  }

  // Get All Pages Function //
  getAllPages(): void {
    this.pagesService.getAllRSSPages().subscribe(resp => {
      if (resp.status == 'success' && resp.status_code == 201) {
        if (resp.data.length !== 0) {
          let pagesData = [];
          resp.data.forEach(function (item) {
            pagesData.push(item.page);
          })
          this.dataSource = new MatTableDataSource(pagesData);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        }
      }
      else {
        this.errorMessage = 'Failed to list pages. Please reload...!!!';
        $('#errorMessageModal').modal('show');
      }
    });
  }

  // On Feed Category Change Function //
  onCategoryChange(id: number) {
    if (id != undefined) {
      var index = this.categoryData.findIndex(function (item, i) {
        return item.id == id;
      });
      this.subCategoryData = this.categoryData[index].subcategories;
      if (this.subCategoryData.length == 0) {
        this.fetchPagesForm.get('subcategory_id').clearValidators();
        this.fetchPagesForm.get('subcategory_id').updateValueAndValidity();
      }
      else {
        this.fetchPagesForm.controls['subcategory_id'].setValue(null);
        this.fetchPagesForm.get('subcategory_id').setValidators([Validators.required]);
        this.fetchPagesForm.get('subcategory_id').updateValueAndValidity();
      }
    }
    else {
      this.fetchPagesForm.controls['subcategory_id'].setErrors(null);
      this.fetchPagesForm.controls['subcategory_id'].setValue(null);
      this.fetchPagesForm.controls['subcategory_id'].setValidators([Validators.required]);
      this.fetchPagesForm.get('subcategory_id').updateValueAndValidity();
      this.fetchPagesForm.get('subcategory_id').markAsPristine();
      this.fetchPagesForm.get('subcategory_id').markAsUntouched();
    }
  }

  // Get Pages By Category Function //
  getPagesByCategory(): void {
    let formData = new FormData();
    formData.append('category_id', this.fetchPagesForm.controls['category_id'].value);
    formData.append('subcategory_id', this.fetchPagesForm.controls['subcategory_id'].value);
    this.dashboardService.getFeedsByCategories(formData).subscribe(resp => {
      if (resp.status == 'success' && resp.status_code == 201) {
        if (resp.data.length !== 0) {
          let pagesData = [];
          resp.data.forEach(function (item) {
            pagesData.push(item.page);
          })
          this.dataSource = new MatTableDataSource(pagesData);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        }
        else {
          this.dataSource = new MatTableDataSource([]);
          this.errorMessage = 'No pages found for selection.';
          $('#errorMessageModal').modal('show');
        }
      }
      else {
        this.errorMessage = 'Unable to list pages for selection. Try again';
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
      category_id: row.category_id,
      meta_title: row.meta_title,
      meta_description: row.meta_description,
      meta_keywords: row.meta_keywords
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
    formData.append('meta_title', this.pageDetailsForm.controls['meta_title'].value);
    formData.append('meta_description', this.pageDetailsForm.controls['meta_description'].value);
    formData.append('meta_keywords', this.pageDetailsForm.controls['meta_keywords'].value);
    if (this.pageIconFile !== null) {
      formData.append('page_icon', this.pageIconFile);
    }
    if (this.coverPhotoFile !== null) {
      formData.append('page_header', this.coverPhotoFile);
    }
    this.pagesService.updatePageDetails(formData).subscribe(resp => {
      if (resp.status == 'success' && resp.status_code == 200) {
        // Calling All Pages Function //
        this.getPagesByCategory();
        this.successMessage = 'Page details updated successfully.';
        $('#successMessageModal').modal('show');
      }
      else {
        this.errorMessage = resp.message;
        $('#errorMessageModal').modal('show');
      }
    });
  }

  // Enable or Disable Comments Function //
  enableOrDisableComments(id: any, status: string): void {
    status = status == 'false' ? 'true' : 'false';
    let formData = new FormData();
    formData.append('comment_status', status);
    formData.append('page_id', id);
    this.pagesService.enableOrDisableComments(formData).subscribe(resp => {
      if (resp.status == 'success' && resp.status_code == 200) {
        this.successMessage = resp.message;
        $('#successMessageModal').modal('show');
        this.getPagesByCategory();
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
        this.getPagesByCategory();
      }
      else {
        this.errorMessage = resp.message;
        $('#errorMessageModal').modal('show');
      }
    });
  }

  // Make as Celebrity Page Function //
  makeAsCelebrityPage(id: any, asCelebrity: string): void {
    asCelebrity = asCelebrity == '0' ? '1' : '0';
    let formData = new FormData();
    formData.append('is_celebrity', asCelebrity);
    formData.append('page_id', id);
    this.pagesService.makeAsCelebrityPage(formData).subscribe(resp => {
      if (resp.status == 'success' && resp.status_code == 200) {
        this.successMessage = resp.message;
        $('#successMessageModal').modal('show');
        this.getPagesByCategory();
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
        this.getPagesByCategory();
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
  is_celebrity: string;
  show_in_homepage: string;
  category_id: string;
  about: string;
}
