import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { CategoryService } from 'app/services/category.service';
import { DashboardService } from 'app/services/dashboard.service';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
declare var $: any;

@Component({
  selector: 'app-dashboard2',
  templateUrl: './dashboard2.component.html',
  styleUrls: ['./dashboard2.component.css']
})
export class Dashboard2Component implements OnInit {

  // Forms Reference //
  addFeedForm: FormGroup;
  viewFeedForm: FormGroup;
  fetchFeedsForm: FormGroup;

  // Files Info //
  addCoverPhoto: File = null;
  addPageIcon: File = null;
  updateCoverPhoto: File = null;
  updatePageIcon: File = null;

  successMessage: string;
  errorMessage: string;
  categoryData: any[];
  subCategoryData: any[];
  feedCategoryData: any[];
  feedSubCategoryData: any[];
  feedsDataList: any[];

  statusList = [
    { id: '1', name: 'Enable' },
    { id: '0', name: 'Disable' }
  ];
  celebrityList = [
    { id: '1', name: 'Yes' },
    { id: '0', name: 'No' }
  ];

  schedulerTimes = [];
  feedsList = [];
  coverPhotoPath: string;
  pageIconPath: string;
  feedId: string;
  feedPageId: string;

  // Displayd Column Name/Id's //
  displayedColumns = ['sno', 'id', 'page_id', 'category_name', 'subcategory_name', 'name', 'url', 'schedule_time', 'source', 'status', 'actions'];
  dataSource: MatTableDataSource<feedsListResp>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  // Applying Filter for Employees Search //
  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    if (this.dataSource == undefined) {
      return false;
    }
    else {
      this.dataSource.filter = filterValue;
    }
  }

  constructor(private formBuilder: FormBuilder, private categoryService: CategoryService, private dashboardService: DashboardService) {

    // Fetch Feeds Form Controls //
    this.fetchFeedsForm = this.formBuilder.group({
      'category_id': [null, [Validators.required]],
      'subcategory_id': [null, Validators.required],
    });

    // Create Feeds Form Controls //
    this.addFeedForm = this.formBuilder.group({
      'category_id': [null, [Validators.required]],
      'sub_category_id': [null, Validators.required],
      'feedTitle': [null, Validators.required],
      'feedURL': [null, Validators.required],
      'feedTime': [null, Validators.required],
      'feedStatus': [null, Validators.required],
      'source': [null, Validators.required],
      'is_celebrity': [null, Validators.required]
    });

    // View or Update Feeds Form Controls //
    this.viewFeedForm = this.formBuilder.group({
      'id': null,
      'page_id': null,
      'category_id': null,
      'sub_category_id': null,
      'category_name': [{ value: null, disabled: true }, Validators.required],
      'sub_category_name': [{ value: null, disabled: true }, Validators.required],
      'feedTitle': [null, Validators.required],
      'feedURL': [null, Validators.required],
      'feedTime': [null, Validators.required],
      'feedStatus': [null, Validators.required],
      'source': [null, Validators.required],
      'created_at': [{ value: '', disabled: true }],
      'updated_at': [{ value: '', disabled: true }],
      'is_celebrity': [null, Validators.required]
    });

    // Get All Categories List Function Invoking //
    this.getAllCategories();
    this.getAllFeeds();
  }

  // Get All Categories Function //
  getAllCategories(): void {
    this.categoryService.getAllCategories().subscribe(resp => {
      if (resp.status == 'success' && resp.status_code == 200) {
        this.feedCategoryData = resp.data;
      }
      else {
        this.errorMessage = 'Failed to list categories. Please reload...!!!';
        $('#errorMessageModal').modal('show');
      }
    });
  }

  // Get Feeds By Category Function //
  getFeedsByCategories(): void {
    let formData = new FormData();
    formData.append('category_id', this.fetchFeedsForm.controls['category_id'].value);
    formData.append('subcategory_id', this.fetchFeedsForm.controls['subcategory_id'].value);
    this.dashboardService.getFeedsByCategories(formData).subscribe(resp => {
      if (resp.status == 'success' && resp.status_code == 201) {
        this.feedsDataList = [];
        if (resp.data.length !== 0) {
          for (let i = 0; i < resp.data.length; i++) {
            let obj = {
              id: resp.data[i].id,
              page_id: resp.data[i].page_id,
              category_name: resp.data[i].page.categories[0].category_name,
              subcategory_name: resp.data[i].page.subcategories[0].category_name,
              name: resp.data[i].page.name,
              url: resp.data[i].url,
              schedule_time: resp.data[i].schedule_time,
              source: resp.data[i].source,
              status: resp.data[i].status,
              page_header: resp.data[i].page.page_header,
              page_icon: resp.data[i].page.page_icon,
              category_id: resp.data[i].page.category_id,
              subcategory_id: resp.data[i].page.subcategory_id,
              created_at: resp.data[i].created_at,
              updated_at: resp.data[i].updated_at,
              is_celebrity: resp.data[i].page.is_celebrity
            };
            this.feedsDataList.push(obj);
          }
          this.dataSource = new MatTableDataSource(this.feedsDataList);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        }
        else {
          this.dataSource = new MatTableDataSource([]);
          this.errorMessage = 'No RSS Feeds found for selection.';
          $('#errorMessageModal').modal('show');
        }

      }
      else {
        this.errorMessage = 'Unable to list RSS Feeds. Try again';
        $('#errorMessageModal').modal('show');
      }
    });
  }

  // Get All Feeds List Function //
  getAllFeeds(): void {
    this.dashboardService.getAllFeeds().subscribe(resp => {
      if (resp.status == 'success' && resp.status_code == 201) {
        var feedsData = [];
        for (let i = 0; i < resp.data.length; i++) {
          // console.log(resp.data[i].page);
          if (resp.data[i].page != null) {
            if (resp.data[i].page.categories != 0 && resp.data[i].page.subcategories != 0) {
              var obj = {
                id: resp.data[i].id,
                page_id: resp.data[i].page_id,
                category_name: resp.data[i].page.categories[0].category_name,
                subcategory_name: resp.data[i].page.subcategories[0].category_name,
                name: resp.data[i].page.name,
                url: resp.data[i].url,
                schedule_time: resp.data[i].schedule_time,
                source: resp.data[i].source,
                status: resp.data[i].status,
                page_header: resp.data[i].page.page_header,
                page_icon: resp.data[i].page.page_icon,
                category_id: resp.data[i].page.category_id,
                subcategory_id: resp.data[i].page.subcategory_id,
                created_at: resp.data[i].created_at,
                updated_at: resp.data[i].updated_at,
                is_celebrity: resp.data[i].page.is_celebrity
              };
              feedsData.push(obj);
            }
          }
        }
        // console.log(feedsData);
        this.dataSource = new MatTableDataSource(feedsData);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      } else {
        this.dataSource = new MatTableDataSource([]);
        this.errorMessage = 'Unable to list RSS Feeds. Please reload';
        $('#errorMessageModal').modal('show');
      }
    });
  }

  // Open Create Feed Modal Function //
  openCreateFeedModal(): void {
    this.feedsList = [];
    this.categoryService.getAllCategories().subscribe(resp => {
      if (resp.status == 'success' && resp.status_code == 200) {
        this.categoryData = resp.data;
        Object.keys(this.addFeedForm.controls).forEach(key => {
          this.addFeedForm.get(key).setValue('');
          this.addFeedForm.get(key).setErrors(null);
          this.addFeedForm.get(key).markAsPristine();
          this.addFeedForm.get(key).markAsUntouched();
          this.addFeedForm.get(key).updateValueAndValidity();
        });
        this.dashboardService.getFeedsSchedulers().subscribe(resp => {
          if (resp.status == 'success' && resp.status_code == 200) {
            this.schedulerTimes = resp.data;
          }
          else {
            this.errorMessage = 'Failed to list feeds schedulers. Please reload...!!!';
            $('#errorMessageModal').modal('show');
          }
        });
        $('#addFeedModal').modal('show');
      }
      else {
        this.errorMessage = 'Failed to list categories. Please reload...!!!';
        $('#errorMessageModal').modal('show');
      }
    });
  }

  // Functions to Handling the File Input On Select @Creation of Feed //
  coverPhotoAtAdd(files: FileList) {
    this.addCoverPhoto = null;
    this.addCoverPhoto = files.item(0);
  }
  pageIconAtAdd(files: FileList) {
    this.addPageIcon = null;
    this.addPageIcon = files.item(0);
  }

  // On Feed Category Change Function //
  onFeedCategoryChange(id: number) {
    if (id != undefined) {
      var index = this.feedCategoryData.findIndex(function (item, i) {
        return item.id == id;
      });
      this.feedSubCategoryData = this.feedCategoryData[index].subcategories;
      if (this.feedSubCategoryData.length == 0) {
        this.fetchFeedsForm.get('subcategory_id').clearValidators();
        this.fetchFeedsForm.get('subcategory_id').updateValueAndValidity();
      }
      else {
        this.fetchFeedsForm.controls['subcategory_id'].setValue(null);
        this.fetchFeedsForm.get('subcategory_id').setValidators([Validators.required]);
        this.fetchFeedsForm.get('subcategory_id').updateValueAndValidity();
      }
    }
    else {
      this.fetchFeedsForm.controls['subcategory_id'].setErrors(null);
      this.fetchFeedsForm.controls['subcategory_id'].setValue(null);
      this.fetchFeedsForm.controls['subcategory_id'].setValidators([Validators.required]);
      this.fetchFeedsForm.get('subcategory_id').updateValueAndValidity();
      this.fetchFeedsForm.get('subcategory_id').markAsPristine();
      this.fetchFeedsForm.get('subcategory_id').markAsUntouched();
    }
  }

  // Category Change Function //
  onCategoryChange(id: number) {
    if (id != undefined) {
      var index = this.categoryData.findIndex(function (item, i) {
        return item.id == id;
      });
      this.subCategoryData = this.categoryData[index].subcategories;
      if (this.subCategoryData.length == 0) {
        this.addFeedForm.get('sub_category_id').clearValidators();
        this.addFeedForm.get('sub_category_id').updateValueAndValidity();
      }
      else {
        this.addFeedForm.controls['sub_category_id'].setValue(null);
        this.addFeedForm.get('sub_category_id').setValidators([Validators.required]);
        this.addFeedForm.get('sub_category_id').updateValueAndValidity();
      }
    }
    else {
      this.addFeedForm.controls['sub_category_id'].setErrors(null);
      this.addFeedForm.controls['sub_category_id'].setValue(null);
      this.addFeedForm.controls['sub_category_id'].setValidators([Validators.required]);
      this.addFeedForm.get('sub_category_id').updateValueAndValidity();
      this.addFeedForm.get('sub_category_id').markAsPristine();
      this.addFeedForm.get('sub_category_id').markAsUntouched();
    }
  }

  // Push Feed into Feeds List //
  pushFeed() {
    var feed = {
      title: this.addFeedForm.controls['feedTitle'].value,
      url: this.addFeedForm.controls['feedURL'].value,
      time: this.addFeedForm.controls['feedTime'].value,
      status: this.addFeedForm.controls['feedStatus'].value,
      source: this.addFeedForm.controls['source'].value,
      coverPhoto: this.addCoverPhoto,
      pageIcon: this.addPageIcon,
      is_celebrity: this.addFeedForm.controls['is_celebrity'].value
    };
    this.feedsList.push(feed);
    (<HTMLInputElement>document.getElementById("addCoverPhotoID")).value = '';
    (<HTMLInputElement>document.getElementById("addPageIconID")).value = '';
    this.addFeedForm.controls['feedTitle'].setValue(null);
    this.addFeedForm.controls['feedURL'].setValue(null);
    this.addFeedForm.controls['feedTime'].setValue(null);
    this.addFeedForm.controls['feedStatus'].setValue(null);
    this.addFeedForm.controls['source'].setValue(null);
    this.addFeedForm.controls['is_celebrity'].setValue(null);
    this.addFeedForm.controls['feedTitle'].setValidators([Validators.required]);
    this.addFeedForm.controls['feedURL'].setValidators([Validators.required]);
    this.addFeedForm.controls['feedTime'].setValidators([Validators.required]);
    this.addFeedForm.controls['feedStatus'].setValidators([Validators.required]);
    this.addFeedForm.controls['source'].setValidators([Validators.required]);
    this.addFeedForm.controls['is_celebrity'].setValidators([Validators.required]);
    this.addFeedForm.get('feedTitle').updateValueAndValidity();
    this.addFeedForm.get('feedURL').updateValueAndValidity();
    this.addFeedForm.get('feedTime').updateValueAndValidity();
    this.addFeedForm.get('feedStatus').updateValueAndValidity();
    this.addFeedForm.get('source').updateValueAndValidity();
    this.addFeedForm.get('is_celebrity').updateValueAndValidity();
    this.addFeedForm.get('feedTitle').markAsPristine();
    this.addFeedForm.get('feedURL').markAsPristine();
    this.addFeedForm.get('feedTime').markAsPristine();
    this.addFeedForm.get('feedStatus').markAsPristine();
    this.addFeedForm.get('source').markAsPristine();
    this.addFeedForm.get('is_celebrity').markAsPristine();
    this.addFeedForm.get('feedTitle').markAsUntouched();
    this.addFeedForm.get('feedURL').markAsUntouched();
    this.addFeedForm.get('feedTime').markAsUntouched();
    this.addFeedForm.get('feedStatus').markAsUntouched();
    this.addFeedForm.get('source').markAsUntouched();
    this.addFeedForm.get('is_celebrity').markAsUntouched();
  }

  // Slice Feed from Added List //
  sliceFeed(index: number) {
    this.feedsList.splice(index, 1);
  }

  // Add Feeds Function //
  addFeeds(): void {
    if (this.feedsList.length == 0) {
      this.errorMessage = "Enter atleast one feed details";
      $('#errorMessageModal').modal('show');
    }
    else {
      $('#addFeedModal').modal('hide');
      let formData = new FormData();
      formData.append('category_id', this.addFeedForm.controls['category_id'].value);
      formData.append('subcategory_id', this.addFeedForm.controls['sub_category_id'].value);
      for (let i = 0; i < this.feedsList.length; i++) {
        formData.append('feeds[' + i + '][url]', this.feedsList[i].url);
        formData.append('feeds[' + i + '][name]', this.feedsList[i].title);
        formData.append('feeds[' + i + '][schedule_time]', this.feedsList[i].time);
        formData.append('feeds[' + i + '][status]', this.feedsList[i].status);
        formData.append('feeds[' + i + '][page_header]', this.feedsList[i].coverPhoto);
        formData.append('feeds[' + i + '][page_icon]', this.feedsList[i].pageIcon);
        formData.append('feeds[' + i + '][source]', this.feedsList[i].source);
        formData.append('feeds[' + i + '][is_celebrity]', this.feedsList[i].is_celebrity);
      }
      this.dashboardService.addFeeds(formData).subscribe(data => {
        if (data.status == 'success' && data.status_code == 201) {
          this.successMessage = data.message;
          $('#successMessageModal').modal('show');
          if (this.fetchFeedsForm.controls['category_id'].value && this.fetchFeedsForm.controls['subcategory_id'].value) {
            this.getFeedsByCategories();
          }
        } else {
          this.errorMessage = data.message;
          $('#errorMessageModal').modal('show');
        }
      });
    }
  }

  // View feed Details Function //
  viewFeedDetails(row: any): void {
    (<HTMLInputElement>document.getElementById('updateCoverPhotoID')).value = '';
    (<HTMLInputElement>document.getElementById('updatePageIconID')).value = '';
    this.coverPhotoPath = row.page_header;
    this.pageIconPath = row.page_icon;
    if (this.schedulerTimes.length == 0) {
      this.dashboardService.getFeedsSchedulers().subscribe(resp => {
        if (resp.status == 'success' && resp.status_code == 200) {
          this.schedulerTimes = resp.data;
        }
        else {
          this.errorMessage = 'Failed to list feeds schedulers. Please reload...!!!';
          $('#errorMessageModal').modal('show');
        }
      });
    }
    this.viewFeedForm.setValue({
      id: row.id,
      page_id: row.page_id,
      feedTitle: row.name,
      feedURL: row.url,
      feedStatus: row.status.toString(),
      source: row.source,
      feedTime: parseInt(row.schedule_time),
      category_id: row.category_id,
      sub_category_id: row.subcategory_id,
      created_at: row.created_at,
      updated_at: row.updated_at,
      is_celebrity: row.is_celebrity.toString(),
      category_name: row.category_name,
      sub_category_name: row.subcategory_name
    });
    $('#viewfeedsModal').modal('show');
  }

  // Functions to Handling the File Input On Select @Update of Feed //
  coverPhotoAtUpdate(files: FileList) {
    this.updateCoverPhoto = null;
    this.updateCoverPhoto = files.item(0);
  }
  pageIconAtUpdate(files: FileList) {
    this.updatePageIcon = null;
    this.updatePageIcon = files.item(0);
  }

  // Update Feed Details Function //
  updateFeedDetails(): void {
    $('#viewfeedsModal').modal('hide');
    let updateFormData = new FormData();
    updateFormData.append('feeds[0][id]', this.viewFeedForm.controls['id'].value);
    updateFormData.append('category_id', this.viewFeedForm.controls['category_id'].value);
    updateFormData.append('subcategory_id', this.viewFeedForm.controls['sub_category_id'].value);
    updateFormData.append('page_id', this.viewFeedForm.controls['page_id'].value);
    updateFormData.append('feeds[0][url]', this.viewFeedForm.controls['feedURL'].value);
    updateFormData.append('feeds[0][name]', this.viewFeedForm.controls['feedTitle'].value);
    updateFormData.append('feeds[0][schedule_time]', this.viewFeedForm.controls['feedTime'].value);
    updateFormData.append('feeds[0][status]', this.viewFeedForm.controls['feedStatus'].value);
    updateFormData.append('feeds[0][source]', this.viewFeedForm.controls['source'].value);
    updateFormData.append('feeds[0][is_celebrity]', this.viewFeedForm.controls['is_celebrity'].value);
    if (this.updateCoverPhoto !== null) {
      updateFormData.append('feeds[0][page_header]', this.updateCoverPhoto);
    }
    if (this.updatePageIcon !== null) {
      updateFormData.append('feeds[0][page_icon]', this.updatePageIcon);
    }

    // API Call //
    this.dashboardService.addFeeds(updateFormData).subscribe(data => {
      if (data.status == 'success' && data.status_code == 200) {
        this.successMessage = 'Feed details updated successfully.';
        $('#successMessageModal').modal('show');
        if (this.fetchFeedsForm.controls['category_id'].value && this.fetchFeedsForm.controls['subcategory_id'].value) {
          this.getFeedsByCategories();
        }
      }
      else {
        this.errorMessage = 'Error while updating feed details. Try Again.';
        $('#errorMessageModal').modal('show');
      }
    });
  }

  // Confirm Delete Prompt //
  confirmDelete(row: any): void {
    this.feedId = row.id;
    this.feedPageId = row.page_id;
    $('#confirmDeleteModal').modal('show');
  }

  deleteFeed(): void {
    $('#confirmDeleteModal').modal('hide');
    let deleteFormData = new FormData();
    deleteFormData.append('id', this.feedId);
    deleteFormData.append('page_id', this.feedPageId);

    this.dashboardService.deleteFeedScheduler(deleteFormData).subscribe(resp => {
      if (resp.status == 'success' && resp.status_code == 200) {
        this.successMessage = 'RSS Feed deleted successfully.';
        $('#successMessageModal').modal('show');
        this.getFeedsByCategories();
      }
      else {
        this.errorMessage = 'Error while deleting RSS feed. Try Again.';
        $('#errorMessageModal').modal('show');
      }
    });
  }

  ngOnInit() {
  }

}

export interface feedsListResp {
  id: string;
  page_id: string;
  url: string;
  schedule_time: string;
  page: any;
  category_name: string;
  subcategory_name: string;
  source: string;
}
