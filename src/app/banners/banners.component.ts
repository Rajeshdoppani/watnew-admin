import { Component, OnInit, ViewChild } from '@angular/core';
import { BannersService } from 'app/services/banners.service';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
declare var $: any;

@Component({
  selector: 'app-banners',
  templateUrl: './banners.component.html',
  styleUrls: ['./banners.component.css']
})
export class BannersComponent implements OnInit {

  // Forms Reference //
  addBannersForm: FormGroup;
  viewBannersForm: FormGroup;

  errorMessage: string;
  successMessage: string;
  bannerId: string;

  addBannerImages: File = null;
  updateBannerImages: File = null;

  statusList = [
    { id: 1, name: 'Enable' },
    { id: 0, name: 'Disable' }
  ];

  locationsList = [
    { id: 'POST', name: 'In Post Details' },
    { id: 'LIVE', name: 'In Lives Page' },
    { id: 'GAMES', name: 'In Games Page' },
    { id: 'ABOUT', name: 'In About Page' },
    { id: 'PRIVACY', name: 'In Privacy Page' },
    { id: 'TERMS', name: 'In Terms Page' }
  ];

  // Displayd Column Name/Id's //
  displayedColumns = ['sno', 'title', 'url', 'image', 'created_at', 'status', 'actions'];
  dataSource: MatTableDataSource<bannersListResp>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  // Applying Filter for Employees Search //
  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  constructor(private bannerService: BannersService, private formBuilder: FormBuilder) {

    // Add Banners Form Controls //
    this.addBannersForm = this.formBuilder.group({
      'title': [''],
      'url': [''],
      'description': [''],
      'status': ['', [Validators.required]],
      'locations': ['', [Validators.required]],
      'banner_images[0][path]': ['', Validators.required]
    });

    // View Banners Form Controls //
    this.viewBannersForm = this.formBuilder.group({
      'id': null,
      'title': [''],
      'url': [''],
      'description': [''],
      'imageId': ['', [Validators.required]],
      'status': ['', [Validators.required]],
      'locations': ['', [Validators.required]],
      'imagePath': '',
    });

    // Get All Banners Function Invoking //
    this.getAllBanners();
  }

  // Get All Banners Function //
  getAllBanners(): void {
    this.bannerService.getAllBanners().subscribe(resp => {
      if (resp.status == 'success' && resp.status_code == 200) {
        this.dataSource = new MatTableDataSource(resp.data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
      else {
        this.errorMessage = 'Failed to list banners. Please reload...!!!';
        $('#errorMessageModal').modal('show');
      }
    });
  }

  // Open Create Banners Modal Function //
  openCreateBanner(): void {
    $('#addBannersModal').modal('show');
    this.addBannersForm.reset();
    (<HTMLInputElement>document.getElementById('addImageFilesId')).value = '';
  }

  // Functions to Handling the File Input On Select @Create of Banners //
  imageInputFileAtAdd(files: FileList): void {
    this.addBannerImages = null;
    this.addBannerImages = files.item(0);
  }

  // Create Banner Function //
  createBanner(): void {
    $('#addBannersModal').modal('hide');
    let formData = new FormData();
    formData.append('title', this.addBannersForm.controls['title'].value);
    formData.append('url', this.addBannersForm.controls['url'].value);
    formData.append('status', this.addBannersForm.controls['status'].value);
    formData.append('description', this.addBannersForm.controls['description'].value);
    formData.append('banner_images[0][path]', this.addBannerImages);
    for (let i = 0; i < this.addBannersForm.controls['locations'].value.length; i++) {
      formData.append('banner_locations[' + i + '][path]', this.addBannersForm.controls['locations'].value[i]);
    }
    this.bannerService.createBanners(formData).subscribe(resp => {
      if (resp.status == 'success' && resp.status_code == 201) {
        this.successMessage = 'Banner created successfully.';
        $('#successMessageModal').modal('show');
        this.getAllBanners();
      }
      else {
        this.errorMessage = 'Error while creating banner. Try Again.';
        $('#errorMessageModal').modal('show');
      }
    });
  }

  // View Banner Details Function //
  viewBannerDetails(row: any): void {
    let selectedLocations = [];
    row.bannerlocations.forEach(function (item: any) {
      selectedLocations.push((item.location));
    });

    this.viewBannersForm.setValue({
      id: row.id,
      title: row.title,
      url: row.url,
      description: row.description,
      status: row.status,
      locations: selectedLocations,
      imageId: row.bannerimages[0].id,
      imagePath: row.bannerimages[0].path
    });
    (<HTMLInputElement>document.getElementById('updateImageFilesId')).value = '';
    $('#viewBannersModal').modal('show');
  }

  // Update Banner Details Function //
  updateBannerDetails(): void {
    $('#viewBannersModal').modal('hide');
    let formData = new FormData();
    formData.append('id', this.viewBannersForm.controls['id'].value);
    formData.append('title', this.viewBannersForm.controls['title'].value);
    formData.append('url', this.viewBannersForm.controls['url'].value);
    formData.append('status', this.viewBannersForm.controls['status'].value);
    formData.append('description', this.viewBannersForm.controls['description'].value);
    for (let i = 0; i < this.viewBannersForm.controls['locations'].value.length; i++) {
      formData.append('banner_locations[' + i + '][path]', this.viewBannersForm.controls['locations'].value[i]);
    }
    if(this.updateBannerImages !== null) {
      formData.append('banner_images[0][path]', this.updateBannerImages);
      formData.append('banner_images[0][id]', this.viewBannersForm.controls['imageId'].value);
    }
    
    this.bannerService.createBanners(formData).subscribe(resp => {
      if (resp.status == 'success' && resp.status_code == 200) {
        this.successMessage = 'Banner details updated successfully.';
        $('#successMessageModal').modal('show');
        this.getAllBanners();
      }
      else {
        this.errorMessage = 'Error while updating banner. Try Again.';
        $('#errorMessageModal').modal('show');
      }
    });
  }

  // Functions to Handling the File Input On Select @Update of Banners //
  imageInputFileAtUpdate(files: FileList): void {
    this.updateBannerImages = null;
    this.updateBannerImages = files.item(0);
  }

  // Prompt Confirm Delete Function //
  confirmDelete(row: any): void {
    this.bannerId = row.id;
    $('#confirmDeleteModal').modal('show');
  }

  // Delete Banner Function //
  deleteBanner(): void {
    $('#confirmDeleteModal').modal('hide');
    let formData = new FormData();
    formData.append('id', this.bannerId);
    this.bannerService.deleteBanner(formData).subscribe(resp => {
      if (resp.status == 'success' && resp.status_code == 200) {
        this.successMessage = 'Banner deleted successfully.';
        $('#successMessageModal').modal('show');
        this.getAllBanners();
      }
      else {
        this.errorMessage = 'Error while deleting banner. Try Again.';
        $('#errorMessageModal').modal('show');
      }
    });
  }

  ngOnInit() {
  }

}

export interface bannersListResp {
  id: string;
  title: string;
  url: string;
  description: string;
  status: string;
}