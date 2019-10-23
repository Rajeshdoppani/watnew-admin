import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LiveService } from 'app/services/live.service';
import { AddsService } from 'app/services/adds.service';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
declare var $: any;

@Component({
  selector: 'app-adds-in-posts',
  templateUrl: './adds-in-posts.component.html',
  styleUrls: ['./adds-in-posts.component.css']
})
export class AddsInPostsComponent implements OnInit {

  liveAddForm: FormGroup;
  postAddForm: FormGroup;
  updateLiveAddForm: FormGroup;
  updatePostAddForm: FormGroup;
  statesList: any[];
  errorMessage: string;
  successMessage: string;
  addId: string;
  addImageId: string;
  addImgParentId: string;
  fileType: string;
  liveAddImagesAtCreate: FileList = null;
  liveAddVideosAtCreate: FileList = null;
  priority = 100;
  priorityValues: any;
  addImagesList = [];
  addVideosList = [];

  statusList = [
    { id: 1, name: 'Enable' },
    { id: 0, name: 'Disable' }
  ];

  // Displayd Column Name/Id's //
  displayedColumns = ['sno', 'title', 'url', 'position', 'priority', 'status', 'actions'];
  dataSource: MatTableDataSource<addsListResp>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  // Applying Filter for Employees Search //
  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  constructor(private formBuilder: FormBuilder, private livesService: LiveService, private addsService: AddsService) {

    // Create Live Add Form Controls //
    this.liveAddForm = this.formBuilder.group({
      title: [''],
      description: [''],
      status: ['', Validators.required],
      priority: ['', Validators.required],
      selected_states: ['', Validators.required],
      position: ['', Validators.required],
      url: [''],
      addLiveImages: ['', Validators.required],
      addLiveVideos: ['']
    });

    // Create Post Add Form Controls //
    this.postAddForm = this.formBuilder.group({
      title: [''],
      description: [''],
      status: ['', Validators.required],
      priority: ['', Validators.required],
      position: ['', Validators.required],
      url: [''],
      tag: [''],
      addLiveImages: ['', Validators.required],
      addLiveVideos: ['']
    });

    // Update Live Add Form Controls //
    this.updateLiveAddForm = this.formBuilder.group({
      id: ['', Validators.required],
      title: [''],
      description: [''],
      status: ['', Validators.required],
      priority: ['', Validators.required],
      selected_states: [[], Validators.required],
      position: ['', Validators.required],
      url: [''],
      addLiveImages: [''],
      addLiveVideos: ['']
    });

    // Update Post Add Form Controls //
    this.updatePostAddForm = this.formBuilder.group({
      id: ['', Validators.required],
      title: [''],
      description: [''],
      status: ['', Validators.required],
      priority: ['', Validators.required],
      position: ['', Validators.required],
      url: [''],
      tag: [''],
      addLiveImages: [''],
      addLiveVideos: ['']
    });

    // Get All Function Invoking //
    this.getAllAdds();
  }

  // Get All Adds Function //
  getAllAdds(): void {
    this.addsService.getAllAdds().subscribe(resp => {
      if (resp.status == 'success' && resp.status_code == 200) {
        let addsArray = [];
        resp.data.forEach(function (item) {
          if (item.position == 'LIVE' || item.position == 'POST') {
            addsArray.push(item);
          }
        });
        this.dataSource = new MatTableDataSource(addsArray);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
      else {
        this.dataSource = new MatTableDataSource([]);
        this.errorMessage = resp.message;
        $('#errorMessageModal').modal('show');
      }
    });
  }

  // Prompt Type Of Modal Function //
  openAddsModal(): void {
    $('#promptTypeOfAddModal').modal('show');
  }

  // Open Live Add Creation Modal Function //
  openLiveAddModal(): void {
    $('#promptTypeOfAddModal').modal('hide');
    this.livesService.getAllStates().subscribe(resp => {
      if (resp.status == 'success' && resp.status_code == 200) {
        this.statesList = resp.data;
        this.liveAddForm.reset();
        this.liveAddForm.controls['position'].setValue('LIVE');
        this.priorityValues = [];
        for (var k = 1; k <= this.priority; k++) {
          this.priorityValues.push({"id":k});
        }
        $('#addLiveAddsModal').modal('show');
      }
      else {
        this.errorMessage = resp.message;
        $('#errorMessageModal').modal('show');
      }
    });
  }

  // Open Post Add Creation Modal Function //
  openPostAddModal(): void {
    $('#promptTypeOfAddModal').modal('hide');
    this.postAddForm.reset();
    this.postAddForm.controls['position'].setValue('POST');
    this.priorityValues = [];
    for (var k = 1; k <= this.priority; k++) {
      this.priorityValues.push({"id":k});
    }
    $('#addPostAddsModal').modal('show');
  }

  // Function to handle image & Video files selction event @Live Add Create //
  imageInputFilesAtLiveAdd(files: FileList): void {
    this.liveAddImagesAtCreate = null;
    this.liveAddImagesAtCreate = files;
  }
  videoInputFilesAtLiveAdd(files: FileList): void {
    this.liveAddVideosAtCreate = null;
    this.liveAddVideosAtCreate = files;
  }

  // Create Live Add Function //
  createLiveAdd(): void {
    $('#addLiveAddsModal').modal('hide');
    let formData = new FormData();
    formData.append('title', this.liveAddForm.controls['title'].value);
    formData.append('description', this.liveAddForm.controls['description'].value);
    formData.append('status', this.liveAddForm.controls['status'].value);
    formData.append('priority', this.liveAddForm.controls['priority'].value);
    formData.append('url', this.liveAddForm.controls['url'].value);
    formData.append('position', this.liveAddForm.controls['position'].value);
    for (let i = 0; i < this.liveAddForm.controls['selected_states'].value.length; i++) {
      formData.append('states[' + i + '][id]', this.liveAddForm.controls['selected_states'].value[i]);
    }
    if (this.liveAddImagesAtCreate !== null) {
      for (let j = 0; j < this.liveAddImagesAtCreate.length; j++) {
        formData.append('adds_images[' + j + '][path]', this.liveAddImagesAtCreate[j]);
      }
    }
    if (this.liveAddVideosAtCreate !== null) {
      for (let k = 0; k < this.liveAddVideosAtCreate.length; k++) {
        formData.append('adds_videos[' + k + '][path]', this.liveAddVideosAtCreate[k]);
      }
    }
    this.addsService.createAdds(formData).subscribe(resp => {
      if (resp.status == 'success' && resp.status_code == 201) {
        this.successMessage = resp.message;
        $('#successMessageModal').modal('show');
        this.getAllAdds();
      }
      else {
        this.errorMessage = resp.message;
        $('#errorMessageModal').modal('show');
      }
    });
  }

  // Create Post Add Function //
  createPostAdd(): void {
    $('#addPostAddsModal').modal('hide');
    let formData = new FormData();
    formData.append('title', this.postAddForm.controls['title'].value);
    formData.append('description', this.postAddForm.controls['description'].value);
    formData.append('status', this.postAddForm.controls['status'].value);
    formData.append('priority', this.postAddForm.controls['priority'].value);
    formData.append('url', this.postAddForm.controls['url'].value);
    formData.append('position', this.postAddForm.controls['position'].value);
    formData.append('tag', this.postAddForm.controls['tag'].value);
    if (this.liveAddImagesAtCreate !== null) {
      for (let j = 0; j < this.liveAddImagesAtCreate.length; j++) {
        formData.append('adds_images[' + j + '][path]', this.liveAddImagesAtCreate[j]);
      }
    }
    if (this.liveAddVideosAtCreate !== null) {
      for (let k = 0; k < this.liveAddVideosAtCreate.length; k++) {
        formData.append('adds_videos[' + k + '][path]', this.liveAddVideosAtCreate[k]);
      }
    }
    this.addsService.createAdds(formData).subscribe(resp => {
      if (resp.status == 'success' && resp.status_code == 201) {
        console.log(resp);
        this.successMessage = resp.message;
        $('#successMessageModal').modal('show');
        this.getAllAdds();
      }
      else {
        this.errorMessage = resp.message;
        $('#errorMessageModal').modal('show');
      }
    });
  }

  // View Add Details Function //
  viewAddDetails(row: any): void {
    this.liveAddImagesAtCreate = null;
    this.liveAddVideosAtCreate = null;
    if (row.position == 'LIVE') {
      // Fetching the States Function //
      this.livesService.getAllStates().subscribe(resp => {
        if (resp.status == 'success' && resp.status_code == 200) {
          this.statesList = resp.data;
          this.priorityValues = [];
          for (var k = 1; k <= this.priority; k++) {
            this.priorityValues.push({"id":k});
          }
          // Filtering Selected States from List of States //
          let selectedStates = [];
          row.addsstates.forEach(function (item: any) {
            selectedStates.push(parseInt(item.state_id));
          });
          // Assigning Add Details to Form //
          this.updateLiveAddForm.setValue({
            id: row.id,
            title: row.title,
            description: row.description,
            status: row.status,
            priority: row.priority,
            position: row.position,
            url: row.url,
            selected_states: selectedStates,
            addLiveImages: null,
            addLiveVideos: null
          });
          $('#updateLiveAddsModal').modal('show');
        }
        else {
          this.errorMessage = resp.message;
          $('#errorMessageModal').modal('show');
        }
      });
    } else {
      // console.log(row);
      this.priorityValues = [];
      for (var k = 1; k <= this.priority; k++) {
        this.priorityValues.push({"id":k});
      }
      this.updatePostAddForm.setValue({
        id: row.id,
        title: row.title,
        description: row.description,
        status: row.status,
        priority: row.priority,
        position: row.position,
        url: row.url,
        tag: row.tag,
        addLiveImages: null,
        addLiveVideos: null
      });
      $('#updatePostAddsModal').modal('show');
    }
  }

  // Update Post Add Details Function //
  updateLiveAdd(): void {
    $('#updateLiveAddsModal').modal('hide');
    let formData = new FormData();
    formData.append('id', this.updateLiveAddForm.controls['id'].value);
    formData.append('title', this.updateLiveAddForm.controls['title'].value);
    formData.append('description', this.updateLiveAddForm.controls['description'].value);
    formData.append('status', this.updateLiveAddForm.controls['status'].value);
    formData.append('priority', this.updateLiveAddForm.controls['priority'].value);
    formData.append('url', this.updateLiveAddForm.controls['url'].value);
    formData.append('position', this.updateLiveAddForm.controls['position'].value);
    for (let i = 0; i < this.updateLiveAddForm.controls['selected_states'].value.length; i++) {
      formData.append('states[' + i + '][id]', this.updateLiveAddForm.controls['selected_states'].value[i]);
    }
    if (this.liveAddImagesAtCreate !== null) {
      for (let j = 0; j < this.liveAddImagesAtCreate.length; j++) {
        formData.append('adds_images[' + j + '][path]', this.liveAddImagesAtCreate[j]);
      }
    }
    if (this.liveAddVideosAtCreate !== null) {
      for (let k = 0; k < this.liveAddVideosAtCreate.length; k++) {
        formData.append('adds_videos[' + k + '][path]', this.liveAddVideosAtCreate[k]);
      }
    }
    this.addsService.createAdds(formData).subscribe(resp => {
      if (resp.status == 'success' && resp.status_code == 200) {
        this.successMessage = resp.message;
        $('#successMessageModal').modal('show');
        this.getAllAdds();
      }
      else {
        this.errorMessage = resp.message;
        $('#errorMessageModal').modal('show');
      }
    });
  }

  // Update Post Add Details Function //
  updatePostAdd(): void {
    $('#updatePostAddsModal').modal('hide');
    let formData = new FormData();
    formData.append('id', this.updatePostAddForm.controls['id'].value);
    formData.append('title', this.updatePostAddForm.controls['title'].value);
    formData.append('description', this.updatePostAddForm.controls['description'].value);
    formData.append('status', this.updatePostAddForm.controls['status'].value);
    formData.append('priority', this.updatePostAddForm.controls['priority'].value);
    formData.append('url', this.updatePostAddForm.controls['url'].value);
    formData.append('tag', this.updatePostAddForm.controls['tag'].value);
    formData.append('position', this.updatePostAddForm.controls['position'].value);
    if (this.liveAddImagesAtCreate !== null) {
      for (let j = 0; j < this.liveAddImagesAtCreate.length; j++) {
        formData.append('adds_images[' + j + '][path]', this.liveAddImagesAtCreate[j]);
      }
    }
    if (this.liveAddVideosAtCreate !== null) {
      for (let k = 0; k < this.liveAddVideosAtCreate.length; k++) {
        formData.append('adds_videos[' + k + '][path]', this.liveAddVideosAtCreate[k]);
      }
    }
    this.addsService.createAdds(formData).subscribe(resp => {
      if (resp.status == 'success' && resp.status_code == 200) {
        this.successMessage = resp.message;
        $('#successMessageModal').modal('show');
        this.getAllAdds();
      }
      else {
        this.errorMessage = resp.message;
        $('#errorMessageModal').modal('show');
      }
    });
  }

  // View Add Images Function //
  viewAddImages(row: any): void {
    $('#viewAddImagesModal').modal('show');
    this.addImagesList = row.addsimages;
  }

  // View Add Videos Function //
  viewAddVideos(row: any): void {
    $('#viewAddVideosModal').modal('show');
    this.addVideosList = row.addsvideos;
  }

  // Prompt Delete Add Image Function //
  promptDeleteAddImage(img: any): void {
    $('#viewAddImagesModal').modal('hide');
    this.addImageId = img.id;
    this.addImgParentId = img.adds_id;
    this.fileType = "image";
    $('#deleteAddImageVideoModal').modal('show');
  }

  // Prompt Delete Add Video Function //
  promptDeleteAddVideo(video: any): void {
    $('#viewAddVideosModal').modal('hide');
    this.addImageId = video.id;
    this.addImgParentId = video.adds_id;
    this.fileType = "video";
    $('#deleteAddImageVideoModal').modal('show');
  }

  // Delete Add Image Or Video Function //
  deleteAddImageorVideo(): void {
    $('#deleteAddImageVideoModal').modal('hide');
    let formData = new FormData();
    formData.append('id', this.addImageId);
    formData.append('adds_id', this.addImgParentId);
    this.addsService.deleteAddImageorVideo(formData, this.fileType).subscribe(resp => {
      if (resp.status == 'success' && resp.status_code == 200) {
        this.successMessage = 'Add ' + this.fileType + ' deleted successfully.';
        $('#successMessageModal').modal('show');
        this.getAllAdds();
      }
      else {
        this.errorMessage = 'Error while deleting add ' + this.fileType + '. Try Again.';
        $('#errorMessageModal').modal('show');
      }
    });
  }

  // Prompt Delete Function //
  confirmDelete(row: any): void {
    this.addId = row.id;
    $('#confirmDeleteModal').modal('show');
  }

  // Delete Add Function //
  deleteAdd(): void {
    $('#confirmDeleteModal').modal('hide');
    let formData = new FormData();
    formData.append('id', this.addId);
    this.addsService.deleteAdd(formData).subscribe(resp => {
      if (resp.status == 'success' && resp.status_code == 200) {
        this.successMessage = resp.message;
        $('#successMessageModal').modal('show');
        this.getAllAdds();
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

declare interface addsListResp { }