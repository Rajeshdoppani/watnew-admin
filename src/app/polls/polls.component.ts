import { Component, OnInit, ViewChild } from '@angular/core';
import { PollsService } from 'app/services/polls.service';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { CategoryService } from 'app/services/category.service';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
declare var $: any;
@Component({
  selector: 'app-polls',
  templateUrl: './polls.component.html',
  styleUrls: ['./polls.component.css']
})
export class PollsComponent implements OnInit {

  createPollForm: FormGroup;
  fetchPollsForm: FormGroup;
  viewTextPollDetailsForm: FormGroup;
  viewImagePollDetailsForm: FormGroup;
  categoryData: any[];
  subCategoryData: any[];
  pollsList: any[];
  pollOptionsList = [];
  successMessage: string;
  errorMessage: string;
  file0: File = null;
  file1: File = null;
  file2: File = null;
  file3: File = null;
  file0AtUpdate: File = null;
  file1AtUpdate: File = null;
  pollId: any;

  settings = {
    bigBanner: true,
    timePicker: true,
    format: 'dd-MM-yyyy HH:mm:ss',
    defaultOpen: false
  }

  statusList = [
    { id: 1, name: 'Enable' },
    { id: 0, name: 'Disable' }
  ];

  pollTypes = [
    { type: 'TEXT', name: 'Text Poll' },
    { type: 'IMAGE', name: 'Image Poll' }
  ];

  pollRespTypes = [
    { type: 1, name: 'Text Poll' },
    { type: 2, name: 'Image Poll' }
  ];

  // Displayd Column Name/Id's //
  displayedColumns = ['sno', 'title', 'type', 'status', 'actions'];
  dataSource: MatTableDataSource<pollsDataResp>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

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

  constructor(private formBuilder: FormBuilder, private pollsService: PollsService, private categoryService: CategoryService) {
    // Create Poll Form Controls //
    this.createPollForm = this.formBuilder.group({
      'categories[0][category_id]': ['', Validators.required],
      'subcategory_id': ['', Validators.required],
      'title': ['', Validators.required],
      'options[0][text]': ['', Validators.required],
      'options[1][text]': ['', Validators.required],
      // 'options[2][text]': [''],
      // 'options[3][text]': [''],
      'options[0][image]': [''],
      'options[1][image]': [''],
      // 'options[2][image]': [''],
      // 'options[3][image]': [''],
      'poll_end_at': [new Date()],
      'status': ['', Validators.required],
      'poll_type': [{ value: 'TEXT' }]
    });
    // Fetch Poll Form Controls //
    this.fetchPollsForm = this.formBuilder.group({
      'category_id': ['', Validators.required],
      'subcategory_id': ['']
    });

    // View Text Poll Form Controls //
    this.viewTextPollDetailsForm = this.formBuilder.group({
      id: ['', Validators.required],
      page_id: ['', Validators.required],
      title: ['', Validators.required],
      post_option_type: [{ value: '', disabled: true }, Validators.required],
      status: ['', Validators.required],
      post_end_at: [{ value: '', disabled: true }, Validators.required],
      category_id: ['', Validators.required],
      subcategory_id: ['', Validators.required],
      option1Value: ['', Validators.required],
      option1Id: ['', Validators.required],
      option2Value: ['', Validators.required],
      option2Id: ['', Validators.required]
    });

    // View Image Poll Form Controls //
    this.viewImagePollDetailsForm = this.formBuilder.group({
      id: ['', Validators.required],
      page_id: ['', Validators.required],
      title: ['', Validators.required],
      post_option_type: [{ value: '', disabled: true }, Validators.required],
      status: ['', Validators.required],
      post_end_at: [{ value: '', disabled: true }, Validators.required],
      category_id: ['', Validators.required],
      subcategory_id: ['', Validators.required],
      image1URL: ['', Validators.required],
      image2URL: ['', Validators.required],
      option1Value: ['', Validators.required],
      option1Id: ['', Validators.required],
      option2Value: ['', Validators.required],
      option2Id: ['', Validators.required]
    });

    // Get All Categories Function Invoking //
    this.getAllCategories();
    this.GetPolls();
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

  // Get Sub Categories @Fetch Poll on Category Selection Function //
  onPollCategoryChange(id: number): void {
    if (id != undefined) {
      var index = this.categoryData.findIndex(function (item, i) {
        return item.id == id;
      });
      this.subCategoryData = this.categoryData[index].subcategories;
      if (this.subCategoryData.length == 0) {
        this.fetchPollsForm.get('subcategory_id').clearValidators();
        this.fetchPollsForm.get('subcategory_id').updateValueAndValidity();
      }
      else {
        this.fetchPollsForm.controls['subcategory_id'].setValue(null);
        this.fetchPollsForm.get('subcategory_id').updateValueAndValidity();
      }
    }
    else {
      this.fetchPollsForm.controls['subcategory_id'].setValue(null);
      this.fetchPollsForm.get('subcategory_id').updateValueAndValidity();
      this.fetchPollsForm.get('subcategory_id').markAsPristine();
      this.fetchPollsForm.get('subcategory_id').markAsUntouched();
    }
  }


  GetPolls() {
    this.pollsService.getPollsRecords().subscribe(resp => {
      if (resp.status == 'success' && resp.status_code == 200) {
        this.dataSource = new MatTableDataSource(resp.data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      } else {
        this.dataSource = new MatTableDataSource([]);
        this.errorMessage = resp.message;
        $('#errorMessageModal').modal('show');
      }
    });
  }

  // Fetch Polls Based on Category Selection //
  getPollsByCategories(): void {
    let formData = new FormData();
    formData.append('category_id', this.fetchPollsForm.controls['category_id'].value);
    formData.append('admin_request', '1');
    if (this.fetchPollsForm.controls['subcategory_id'].value !== null && this.fetchPollsForm.controls['subcategory_id'].value !== undefined) {
      formData.append('subcategory_id', this.fetchPollsForm.controls['subcategory_id'].value);
    }
    this.pollsService.getPolls(formData).subscribe(resp => {
      if (resp.status == 'success' && resp.status_code == 200) {
        this.pollsList = resp.data.data;
        if (resp.data.data.length == 0) {
          this.dataSource = new MatTableDataSource([]);
          this.errorMessage = 'No polls found for selected categories.';
          $('#errorMessageModal').modal('show');
        }
        else {
          this.dataSource = new MatTableDataSource(resp.data.data);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        }
      }
      else {
        this.dataSource = new MatTableDataSource([]);
        this.errorMessage = resp.message;
        $('#errorMessageModal').modal('show');
      }
    });
  }

  // Open Create Poll Popup Function //
  openCreatePollModal(): void {
    this.createPollForm.reset();
    this.createPollForm.controls['poll_end_at'].setValue(new Date());
    this.createPollForm.controls['poll_type'].setValue('TEXT');
    $('#createPollModal').modal('show');
  }

  // Get Sub Categories on Category Selection Function //
  onCategoryChange(id: number): void {
    if (id != undefined) {
      var index = this.categoryData.findIndex(function (item, i) {
        return item.id == id;
      });
      this.subCategoryData = this.categoryData[index].subcategories;
      if (this.subCategoryData.length == 0) {
        this.createPollForm.get('subcategory_id').clearValidators();
        this.createPollForm.get('subcategory_id').updateValueAndValidity();
      }
      else {
        this.createPollForm.controls['subcategory_id'].setValue(null);
        this.createPollForm.get('subcategory_id').setValidators([Validators.required]);
        this.createPollForm.get('subcategory_id').updateValueAndValidity();
      }
    }
    else {
      this.createPollForm.controls['subcategory_id'].setErrors(null);
      this.createPollForm.controls['subcategory_id'].setValue(null);
      this.createPollForm.controls['subcategory_id'].setValidators([Validators.required]);
      this.createPollForm.get('subcategory_id').updateValueAndValidity();
      this.createPollForm.get('subcategory_id').markAsPristine();
      this.createPollForm.get('subcategory_id').markAsUntouched();
    }
  }

  // On Poll Type Change @Create Function //
  onPollTypeChange(type: string): void {
    if (type == 'TEXT') {
      this.createPollForm = this.formBuilder.group({
        'categories[0][category_id]': ['', Validators.required],
        'subcategory_id': ['', Validators.required],
        'title': ['', Validators.required],
        'options[0][text]': ['', Validators.required],
        'options[1][text]': ['', Validators.required],
        'options[0][image]': [''],
        'options[1][image]': [''],
        'poll_end_at': [new Date()],
        'status': ['', Validators.required],
        'poll_type': [{ value: type }]
      });
    }
    else {
      this.createPollForm = this.formBuilder.group({
        'categories[0][category_id]': ['', Validators.required],
        'subcategory_id': ['', Validators.required],
        'title': ['', Validators.required],
        'options[0][text]': [''],
        'options[1][text]': [''],
        'options[0][image]': ['', Validators.required],
        'options[1][image]': ['', Validators.required],
        'poll_end_at': [new Date()],
        'status': ['', Validators.required],
        'poll_type': [{ value: type }]
      });
    }
    this.createPollForm.reset();
    this.createPollForm.controls['poll_type'].setValue(type);
  }

  // Handling File Input of Poll Image Selection @Creation Functions //
  imageOption0Fun(files: FileList): void {
    this.file0 = null;
    this.file0 = files.item(0);
  }

  imageOption1Fun(files: FileList): void {
    this.file1 = null;
    this.file1 = files.item(0);
  }

  /*
  imageOption2Fun(files: FileList): void {
    this.file2 = null;
    this.file2 = files.item(0);
  }

  imageOption3Fun(files: FileList): void {
    this.file3 = null;
    this.file3 = files.item(0);
  }
  */

  // Create Poll Function //
  createPoll() {
    let date = JSON.stringify(new Date(this.createPollForm.controls['poll_end_at'].value));
    let pollEndDate = date.slice(1, 11) + ' ' + date.slice(12, 20);
    $('#createPollModal').modal('hide');
    let formData = new FormData();
    formData.append('page_id', '412');
    formData.append('categories[0][category_id]', this.createPollForm.controls['categories[0][category_id]'].value);
    formData.append('categories[0][subcategory_id]', this.createPollForm.controls['subcategory_id'].value);
    formData.append('title', this.createPollForm.controls['title'].value);
    formData.append('status', this.createPollForm.controls['status'].value);
    formData.append('poll_end_at', pollEndDate);
    if (this.createPollForm.controls['poll_type'].value == 'TEXT') {
      formData.append('post_option_type', '1');
      formData.append('options[0][text]', this.createPollForm.controls['options[0][text]'].value);
      formData.append('options[1][text]', this.createPollForm.controls['options[1][text]'].value);
      /*
      if ((this.createPollForm.controls['options[2][text]'].value !== null && this.createPollForm.controls['options[2][text]'].value !== '') && (this.createPollForm.controls['options[3][text]'].value !== null && this.createPollForm.controls['options[3][text]'].value !== '')) {
        formData.append('options[2][text]', this.createPollForm.controls['options[2][text]'].value);
        formData.append('options[3][text]', this.createPollForm.controls['options[3][text]'].value);
      }
      */
    }
    else {
      formData.append('post_option_type', '2');
      formData.append('options[0][path]', this.file0);
      formData.append('options[1][path]', this.file1);
      formData.append('options[0][text]', 'null');
      formData.append('options[1][text]', 'null');
      /*
      if (this.file2 !== null && this.file3 !== null) {
        formData.append('options[2][image]', this.file2);
        formData.append('options[3][image]', this.file3);
      }
      */
    }

    this.pollsService.createOrUpdatePoll(formData).subscribe(resp => {
      if (resp.status == 'success' && resp.status_code == 201) {
        this.successMessage = resp.message;
        this.GetPolls();
        $('#successMessageModal').modal('show');
        if (this.fetchPollsForm.valid) {
          this.getPollsByCategories();
        }
      }
      else {
        this.errorMessage = resp.message;
        $('#errorMessageModal').modal('show');
      }
    });
  }

  // View Poll Details Function //
  viewPollDetails(row: any): void {
    if (row.post_option_type == 1) {
      // Assigning Values to Text Poll Form Controls //
      this.viewTextPollDetailsForm.setValue({
        id: row.id,
        page_id: row.page_id,
        title: row.title,
        post_option_type: row.post_option_type,
        post_end_at: row.post_end_at,
        status: row.status,
        category_id: row.postcategories[0].category_id,
        subcategory_id: row.postcategories[0].subcategory_id,
        option1Value: row.postoptions[0].text,
        option1Id: row.postoptions[0].id,
        option2Value: row.postoptions[1].text,
        option2Id: row.postoptions[1].id
      });
      this.pollOptionsList = row.postoptions;
      $('#viewTextPollDetailsModal').modal('show');
    }
    else {
      // Assigning Values to Image Poll Form Controls //
      this.viewImagePollDetailsForm = this.formBuilder.group({
        id: row.id,
        page_id: row.page_id,
        title: row.title,
        post_option_type: row.post_option_type,
        status: row.status,
        post_end_at: row.post_end_at,
        category_id: row.postcategories[0].category_id,
        subcategory_id: row.postcategories[0].subcategory_id,
        image1URL: row.postoptions[0].path,
        image2URL: row.postoptions[1].path,
        option1Value: null,
        option1Id: row.postoptions[0].id,
        option2Value: null,
        option2Id: row.postoptions[1].id
      });
      $('#viewImagePollDetailsModal').modal('show');
    }
  }

  // Image Files Selection @Poll Update Functions //
  imageOption0FunAtUpdate(files: FileList): void {
    this.file0AtUpdate = null;
    this.file0AtUpdate = files.item(0);
  }
  imageOption1FunAtUpdate(files: FileList): void {
    this.file1AtUpdate = null;
    this.file1AtUpdate = files.item(0);
  }

  // Update Text Poll Details Function //
  updateTextPollDetails(): void {
    $('#viewTextPollDetailsModal').modal('hide');
    let formData = new FormData();
    formData.append('id', this.viewTextPollDetailsForm.controls['id'].value);
    formData.append('page_id', this.viewTextPollDetailsForm.controls['page_id'].value);
    formData.append('categories[0][category_id]', this.viewTextPollDetailsForm.controls['category_id'].value);
    formData.append('categories[0][subcategory_id]', this.viewTextPollDetailsForm.controls['subcategory_id'].value);
    formData.append('title', this.viewTextPollDetailsForm.controls['title'].value);
    formData.append('status', this.viewTextPollDetailsForm.controls['status'].value);
    formData.append('poll_end_at', this.viewTextPollDetailsForm.controls['post_end_at'].value);
    formData.append('post_option_type', '1');
    formData.append('options[0][id]', this.viewTextPollDetailsForm.controls['option1Id'].value);
    formData.append('options[0][text]', this.viewTextPollDetailsForm.controls['option1Value'].value);
    formData.append('options[1][id]', this.viewTextPollDetailsForm.controls['option2Id'].value);
    formData.append('options[1][text]', this.viewTextPollDetailsForm.controls['option2Value'].value);
    this.pollsService.createOrUpdatePoll(formData).subscribe(resp => {
      if (resp.status == 'success' && resp.status_code == 200) {
        this.successMessage = resp.message;
        this.GetPolls();
        $('#successMessageModal').modal('show');
        if (this.fetchPollsForm.valid) {
          this.getPollsByCategories();
        }
      }
      else {
        this.errorMessage = resp.message;
        $('#errorMessageModal').modal('show');
      }
    });
  }

  // Update Image Poll Details Function //
  updateImagePollDetails(): void {
    $('#viewImagePollDetailsModal').modal('hide');
    let formData = new FormData();
    formData.append('id', this.viewImagePollDetailsForm.controls['id'].value);
    formData.append('page_id', this.viewImagePollDetailsForm.controls['page_id'].value);
    formData.append('categories[0][category_id]', this.viewImagePollDetailsForm.controls['category_id'].value);
    formData.append('categories[0][subcategory_id]', this.viewImagePollDetailsForm.controls['subcategory_id'].value);
    formData.append('title', this.viewImagePollDetailsForm.controls['title'].value);
    formData.append('status', this.viewImagePollDetailsForm.controls['status'].value);
    formData.append('poll_end_at', this.viewImagePollDetailsForm.controls['post_end_at'].value);
    formData.append('post_option_type', '2');
    formData.append('options[0][text]', 'null');
    formData.append('options[1][text]', 'null');
    if (this.file0AtUpdate !== null) {
      formData.append('options[0][path]', this.file0AtUpdate);
      formData.append('options[0][id]', this.viewImagePollDetailsForm.controls['option1Id'].value);
    }
    if (this.file1AtUpdate !== null) {
      formData.append('options[1][path]', this.file1AtUpdate);
      formData.append('options[1][id]', this.viewImagePollDetailsForm.controls['option2Id'].value);
    }
    this.pollsService.createOrUpdatePoll(formData).subscribe(resp => {
      if (resp.status == 'success' && resp.status_code == 200) {
        this.successMessage = resp.message;
        this.GetPolls();
        $('#successMessageModal').modal('show');
        if (this.fetchPollsForm.valid) {
          this.getPollsByCategories();
        }
      }
      else {
        this.errorMessage = resp.message;
        $('#errorMessageModal').modal('show');
      }
    });
  }

  // Prompt Poll Delete Function //
  confirmPollDelete(row: any): void {
    this.pollId = row.id;
    $('#confirmDeleteModal').modal('show');
  }

  deletePoll(): void {
    $('#confirmDeleteModal').modal('hide');
    let formData = new FormData();
    formData.append('post_id', this.pollId);
    this.pollsService.deletePoll(formData).subscribe(resp => {
      if (resp.status == 'success' && resp.status_code == 200) {
        this.successMessage = resp.message;
        this.GetPolls();
        $('#successMessageModal').modal('show');
        this.getPollsByCategories();
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

export interface pollsDataResp {

}
