import { Component, OnInit, ViewChild } from '@angular/core';
import { HeroimagesService } from 'app/services/heroimages.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
declare var $: any;

@Component({
  selector: 'app-heroimages',
  templateUrl: './heroimages.component.html',
  styleUrls: ['./heroimages.component.css']
})
export class HeroimagesComponent implements OnInit {

  createHeroImageForm: FormGroup;
  heroImageDetailsForm: FormGroup;
  heroImageAtAdd: File = null;
  heroImageAtUpdate: File = null;
  successMessage: string;
  errorMessage: string;
  heroImageId: any;

  statusList = [
    { id: 1, name: 'Enable' },
    { id: 0, name: 'Disable' }
  ];

  // Displayd Column Name/Id's //
  displayedColumns = ['sno', 'title', 'hero_image', 'status', 'created_at', 'actions'];
  dataSource: MatTableDataSource<herosListResp>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  // Applying Filter for Employees Search //
  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  constructor(private formBuilder: FormBuilder, private heroService: HeroimagesService) {
    // Create Hero Image Form Controls //
    this.createHeroImageForm = this.formBuilder.group({
      title: [''],
      description: [''],
      url: [''],
      status: ['', Validators.required],
      hero_image: ['', [Validators.required]]
    });

    // View Hero Image Form Controls //
    this.heroImageDetailsForm = this.formBuilder.group({
      id: ['', Validators.required],
      title: [''],
      description: [''],
      url: [''],
      status: ['', Validators.required],
      hero_image: [''],
      hero_image_url: [''],
      created_at: [{ value: '', disabled: true }],
      updated_at: [{ value: '', disabled: true }]
    });

    // Get Hero Images Function Invoking //
    this.getAllHeroImages();
  }

  // Get Hero Images Function //
  getAllHeroImages() {
    this.heroService.getHeroImageDetails().subscribe(resp => {
      if (resp.status == 'success' && resp.status_code == 200) {
        if (resp.data.length !== 0) {
          this.dataSource = new MatTableDataSource(resp.data);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        }
        else {
          this.dataSource = new MatTableDataSource([]);
          this.errorMessage = 'No hero images.';
          $('#errorMessageModal').modal('show');
        }
      }
      else {
        this.dataSource = new MatTableDataSource([]);
        this.errorMessage = 'Unable to list hero images. Try again';
        $('#errorMessageModal').modal('show');
      }
    });
  }

  // Hero Images Create Modal Function //
  openHeroImagesCreateModal(): void {
    $('#createHeroImageModal').modal('show');
    this.createHeroImageForm.reset();
  }

  // Function to Handling the File Input On Select @Creation of Hero Image //
  imageInputFileAtAdd(files: FileList): void {
    this.heroImageAtAdd = null;
    this.heroImageAtAdd = files.item(0);
  }

  imageInputFileAtUpdate(files: FileList): void {
    this.heroImageAtUpdate = null;
    this.heroImageAtUpdate = files.item(0);
  }

  // View Hero Image Details Function //
  viewHeroImageDetails(row: any): void {
    this.heroImageDetailsForm.setValue({
      id: row.id,
      title: row.title,
      status: row.status,
      url: row.url,
      description: row.description,
      hero_image_url: row.hero_image,
      created_at: row.created_at,
      updated_at: row.updated_at,
      hero_image: ''
    });
    this.heroImageAtUpdate = null;
    $('#heroImageDetailsModal').modal('show');
  }

  // Create Hero Image Function //
  createHeroImage(): void {
    $('#createHeroImageModal').modal('hide');
    let formData = new FormData();
    formData.append('title', this.createHeroImageForm.controls['title'].value);
    formData.append('description', this.createHeroImageForm.controls['description'].value);
    formData.append('status', this.createHeroImageForm.controls['status'].value);
    formData.append('hero_image', this.heroImageAtAdd);

    this.heroService.createHeroImage(formData).subscribe(resp => {
      if (resp.status == 'success' && resp.status_code == 201) {
        this.successMessage = resp.message;
        $('#successMessageModal').modal('show');
        this.getAllHeroImages();
      }
      else {
        this.errorMessage = resp.message;
        $('#errorMessageModal').modal('show');
      }
    });
  }

  // Update Gero Image Details Function //
  updateHeroImage(): void {
    $('#heroImageDetailsModal').modal('hide');
    let formData = new FormData();
    formData.append('id', this.heroImageDetailsForm.controls['id'].value);
    formData.append('title', this.heroImageDetailsForm.controls['title'].value);
    formData.append('description', this.heroImageDetailsForm.controls['description'].value);
    formData.append('status', this.heroImageDetailsForm.controls['status'].value);
    if (this.heroImageAtUpdate !== null) {
      formData.append('hero_image', this.heroImageAtUpdate);
    }
    this.heroService.createHeroImage(formData).subscribe(resp => {
      if (resp.status == 'success' && resp.status_code == 200) {
        this.successMessage = resp.message;
        $('#successMessageModal').modal('show');
        this.getAllHeroImages();
      }
      else {
        this.errorMessage = resp.message;
        $('#errorMessageModal').modal('show');
      }
    });
  }

  // Prompt Delete Hero Image Function //
  confirmDeleteHeroImage(row: any): void {
    this.heroImageId = row.id;
    $('#confirmDeleteModal').modal('show');
  }

  // Delete Hero Image Function //
  deleteHeroImage(): void {
    $('#confirmDeleteModal').modal('hide');
    let formData = new FormData();
    formData.append('id', this.heroImageId);
    this.heroService.deletHeroImage(formData).subscribe(resp => {
      if (resp.status == 'success' && resp.status_code == 200) {
        this.successMessage = resp.message;
        $('#successMessageModal').modal('show');
        this.getAllHeroImages();
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

declare interface herosListResp {
  id: number;
  title: string;
  description: string;
  hero_image: string;
  status: string;
  created_at: string;
  updated_at: string;
}