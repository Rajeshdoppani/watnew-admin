import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { AddsService } from 'app/services/adds.service';
declare var $: any;

@Component({
  selector: 'app-adds',
  templateUrl: './adds.component.html',
  styleUrls: ['./adds.component.css']
})
export class AddsComponent implements OnInit {

  // Forms Reference //
  addAddsForm: FormGroup;
  viewAddsForm: FormGroup;

  errorMessage: string;
  successMessage: string;
  addId: string;
  addImageId: string;
  addImgParentId: string;
  fileType: string;

  addAddImages: FileList = null;
  addAddVideos: FileList = null;
  updateAddImages: FileList = null;
  updateAddVideos: FileList = null;

  addImagesList = [];
  addVideosList = [];

  statusList = [
    { id: 1, name: 'Enable' },
    { id: 0, name: 'Disable' }
  ];

  positionsList = [
    { id: 'LEFT', name: 'At Left Side' },
    { id: 'RIGHT', name: 'At Right Side' }
  ];

  // Displayd Column Name/Id's //
  displayedColumns = ['sno', 'title', 'url', 'position', 'status', 'actions'];
  dataSource: MatTableDataSource<addsListResp>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  // Applying Filter for Employees Search //
  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  constructor(private formBuilder: FormBuilder, private addsService: AddsService) {

    // Add Adds Form Controls //
    this.addAddsForm = this.formBuilder.group({
      'status': ['', Validators.required],
      'addImages': ['', Validators.required],
      'position': ['', Validators.required],
      'title': [''],
      'url': [''],
      'description': ['']
    });

    // View Adds Form Controls //
    this.viewAddsForm = this.formBuilder.group({
      'id': null,
      'status': ['', Validators.required],
      'position': ['', Validators.required],
      'title': [''],
      'url': [''],
      'description': ['']
    });

    // Get All Adds Function Invoking //
    this.getAllAdds();
  }

  // Get All Adds Function //
  getAllAdds(): void {
    this.addsService.getAllAdds().subscribe(resp => {
      if (resp.status == 'success' && resp.status_code == 200) {
        let addsArray = [];
        resp.data.forEach(function (item) {
          if (item.position == 'LEFT' || item.position == 'RIGHT') {
            addsArray.push(item);
          }
        });
        this.dataSource = new MatTableDataSource(addsArray);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
      else {
        this.errorMessage = 'Failed to list adds. Please reload...!!!';
        $('#errorMessageModal').modal('show');
      }
    });
  }

  // Open Add Creation Modal Function //
  openCreateAddsModal(): void {
    $('#addAddsModal').modal('show');
    this.addAddsForm.reset();
    (<HTMLInputElement>document.getElementById('addImageFilesId')).value = '';
    (<HTMLInputElement>document.getElementById('addVideoFilesId')).value = '';
  }

  // Functions to Handling the File Input On Select @Create of Adds //
  imageInputFileAtAdd(files: FileList): void {
    this.addAddImages = null;
    this.addAddImages = files;
  }

  videoInputFileAtAdd(files: FileList): void {
    this.addAddVideos = null;
    this.addAddVideos = files;
  }

  // Create Adds Function //
  createAdd(): void {
    $('#addAddsModal').modal('hide');
    let formData = new FormData();
    formData.append('title', this.addAddsForm.controls['title'].value);
    formData.append('url', this.addAddsForm.controls['url'].value);
    formData.append('status', this.addAddsForm.controls['status'].value);
    formData.append('position', this.addAddsForm.controls['position'].value);
    formData.append('description', this.addAddsForm.controls['description'].value);
    if (this.addAddImages !== null) {
      for (let i = 0; i < this.addAddImages.length; i++) {
        formData.append('adds_images[' + i + '][path]', this.addAddImages[i]);
      }
    }
    if (this.addAddVideos !== null) {
      for (let j = 0; j < this.addAddVideos.length; j++) {
        formData.append('adds_videos[' + j + '][path]', this.addAddVideos[j]);
      }
    }
    this.addsService.createAdds(formData).subscribe(resp => {
      if (resp.status == 'success' && resp.status_code == 201) {
        this.successMessage = 'Add created successfully.';
        $('#successMessageModal').modal('show');
        this.getAllAdds();
      }
      else {
        this.errorMessage = 'Error while creating add. Try Again.';
        $('#errorMessageModal').modal('show');
      }
    });
  }

  // View Add Details Function //
  viewAddDetails(row: any): void {
    this.viewAddsForm.setValue({
      id: row.id,
      title: row.title,
      url: row.url,
      description: row.description,
      status: row.status,
      position: row.position
    });
    (<HTMLInputElement>document.getElementById('updateImageFilesId')).value = '';
    (<HTMLInputElement>document.getElementById('updateVideoFilesId')).value = '';
    $('#viewAddsModal').modal('show');
  }

  // View Add Images Function //
  viewAddImages(row: any): void {
    if (row.addsimages.length == 0) {
      this.errorMessage = 'No Images for this add to display.';
      $('#errorMessageModal').modal('show');
    }
    else {
      $('#viewAddImagesModal').modal('show');
      this.addImagesList = row.addsimages;
    }
  }

  // View Add Videos Function //
  viewAddVideos(row: any): void {
    if (row.addsvideos.length == 0) {
      this.errorMessage = 'No Videos for this add to display.';
      $('#errorMessageModal').modal('show');
    }
    else {
      $('#viewAddVideosModal').modal('show');
      this.addVideosList = row.addsvideos;
    }
  }

  // Functions to Handling the File Input On Select @Update of Adds //
  imageInputFileAtUpdate(files: FileList): void {
    this.updateAddImages = null;
    this.updateAddImages = files;
  }
  videoInputFileAtUpdate(files: FileList): void {
    this.updateAddVideos = null;
    this.updateAddVideos = files;
  }

  // Update Add Details Function //
  updateAddDetails(): void {
    $('#viewAddsModal').modal('hide');
    let formData = new FormData();
    formData.append('id', this.viewAddsForm.controls['id'].value);
    formData.append('title', this.viewAddsForm.controls['title'].value);
    formData.append('url', this.viewAddsForm.controls['url'].value);
    formData.append('status', this.viewAddsForm.controls['status'].value);
    formData.append('position', this.viewAddsForm.controls['position'].value);
    formData.append('description', this.viewAddsForm.controls['description'].value);
    if (this.updateAddImages !== null) {
      for (let i = 0; i < this.updateAddImages.length; i++) {
        formData.append('adds_images[' + i + '][path]', this.updateAddImages[i]);
      }
    }
    if (this.updateAddVideos !== null) {
      for (let j = 0; j < this.updateAddVideos.length; j++) {
        formData.append('adds_videos[' + j + '][path]', this.updateAddVideos[j]);
      }
    }
    this.addsService.createAdds(formData).subscribe(resp => {
      if (resp.status == 'success' && resp.status_code == 200) {
        this.successMessage = 'Add details updated successfully.';
        $('#successMessageModal').modal('show');
        this.getAllAdds();
      }
      else {
        this.errorMessage = 'Error while updating add details. Try Again.';
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
        this.successMessage = 'Add deleted successfully.';
        $('#successMessageModal').modal('show');
        this.getAllAdds();
      }
      else {
        this.errorMessage = 'Error while deleting add. Try Again.';
        $('#errorMessageModal').modal('show');
      }
    });
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

  ngOnInit() {
  }

}

export interface addsListResp {
  id: string;
  title: string;
  url: string;
  position: string;
  description: string;
  status: string;
}
