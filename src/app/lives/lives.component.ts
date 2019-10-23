import { Component, OnInit, ViewChild } from '@angular/core';
import { LiveService } from 'app/services/live.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { EmbedVideoService } from 'ngx-embed-video';
import { MatOption, MatAutocomplete } from '@angular/material';
declare var $: any;

@Component({
  selector: 'app-lives',
  templateUrl: './lives.component.html',
  styleUrls: ['./lives.component.css']
})
export class LivesComponent implements OnInit {

  createLiveForm: FormGroup;
  fetchLivesForm: FormGroup;
  liveDetailsForm: FormGroup;
  statesList = [];
  successMessage: string;
  errorMessage: string;
  liveImageAtCreate: File = null;
  liveImageAtUpdate: File = null;
  liveDetails: any;
  liveId: any;
  liveImagesList: any[];
  liveYVideosList: any[];

  statusList = [
    { id: 1, name: 'Enable' },
    { id: 0, name: 'Disable' }
  ];

  // Displayd Column Name/Id's //
  displayedColumns = ['sno', 'title', 'description', 'status', 'liveviews_count', 'actions'];
  dataSource: MatTableDataSource<livesListResp>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('allSelected') private allSelected: MatOption;
  @ViewChild('alladdSelected') private alladdSelected: MatOption;
  @ViewChild('allUpdateSelected') private allUpdateSelected: MatOption;

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

  constructor(private liveService: LiveService, private formBuilder: FormBuilder, private embededService: EmbedVideoService) {
    // Fetch Lives Form Controls //
    this.fetchLivesForm = this.formBuilder.group({
      states: ['', Validators.required]
    });

    // Create Live Form Controls //
    this.createLiveForm = this.formBuilder.group({
      'states': ['', Validators.required],
      'status': ['', Validators.required],
      'title': ['', Validators.required],
      'description': [''],
      'images[0][path]': [''],
      'yvideos[0][path]': null
    });

    // Live Details Form Controls //
    this.liveDetailsForm = this.formBuilder.group({
      'id': ['', Validators.required],
      'page_id': ['', Validators.required],
      'title': ['', Validators.required],
      'description': [null],
      'status': ['', Validators.required],
      'states': [[], Validators.required],
      'images[0][path]': [''],
      'yvideos[0][path]': null
    });

    // Get All States Invoking //
    this.getAllStates('No');
    this.getAll();
  }

  // Get Lives Data //
  getAll() {
    this.liveService.getAllData().subscribe(resp => {
      if (resp.status == 'success' && resp.status_code == 200) {
        if (resp.data.length !== 0) {
          this.dataSource = new MatTableDataSource(resp.data);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        } else {
          this.dataSource = new MatTableDataSource([]);
          this.errorMessage = 'No lives found for selection.';
          $('#errorMessageModal').modal('show');
        }
      } else {
        this.dataSource = new MatTableDataSource([]);
        this.errorMessage = 'No lives found for selection.';
        $('#errorMessageModal').modal('show');
      }
    });
  }

  // Get All Lives Function //
  getAllLives(): void {
    let formData = new FormData();
    formData.append('admin_request', '1');
    for (let i = 0; i < this.fetchLivesForm.controls['states'].value.length; i++) {
      if (this.fetchLivesForm.controls['states'].value[i] != '0') {
        formData.append('states[' + i + '][id]', this.fetchLivesForm.controls['states'].value[i]);
      }
    }
    this.liveService.getAllLives(formData).subscribe(resp => {
      if (resp.status == 'success' && resp.status_code == 200) {
        if (resp.data.length !== 0) {
          this.dataSource = new MatTableDataSource(resp.data);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        }
        else {
          this.dataSource = new MatTableDataSource([]);
          this.errorMessage = 'No lives found for selection.';
          $('#errorMessageModal').modal('show');
        }
      }
      else {
        this.dataSource = new MatTableDataSource([]);
        this.errorMessage = resp.message;
        $('#errorMessageModal').modal('show');
      }
    });
  }

  getAllStates(key: string): void {
    this.liveService.getAllStates().subscribe(resp => {
      if (resp.status == 'success' && resp.status_code == 200) {
        this.statesList = resp.data;
        // console.log(this.statesList);
        if (this.statesList.length !== 0 && key == 'YES') {
          $('#addLiveModal').modal('show');
        }
      }
      else {
        this.errorMessage = resp.message;
        $('#errorMessageModal').modal('show');
      }
    });
  }


  // select All States //
  tosslePerOne(all) {
    if (this.allSelected.selected) {
      this.allSelected.deselect();
      return false;
    }
    if (this.fetchLivesForm.controls.states.value.length == this.statesList.length)
      this.allSelected.select();
  }

  toggleAllSelection() {
    if (this.allSelected.selected) {
      this.fetchLivesForm.controls.states
        .patchValue([...this.statesList.map(item => item.id), 0]);
    } else {
      this.fetchLivesForm.controls.states.patchValue([]);
    }
  }


  // select All States ADD //
  toggleADD(all) {
    if (this.alladdSelected.selected) {
      this.alladdSelected.deselect();
      return false;
    }
    if (this.createLiveForm.controls.states.value.length == this.statesList.length)
      this.alladdSelected.select();
  }

  toggleAddSelection() {
    if (this.alladdSelected.selected) {
      this.createLiveForm.controls.states
        .patchValue([...this.statesList.map(item => item.id), 0]);
    } else {
      this.createLiveForm.controls.states.patchValue([]);
    }
  }

  // select All States Update //
  toggleUpdate(all) {
    if (this.allUpdateSelected.selected) {
      this.allUpdateSelected.deselect();
      return false;
    }
    if (this.liveDetailsForm.controls.states.value.length == this.statesList.length)
      this.allUpdateSelected.select();
  }

  toggleUpdateSelection() {
    if (this.allUpdateSelected.selected) {
      this.liveDetailsForm.controls.states
        .patchValue([...this.statesList.map(item => item.id), 0]);
    } else {
      this.liveDetailsForm.controls.states.patchValue([]);
    }
  }

  // Open Live Creation Modal Function //
  openCreateLiveModal(): void {
    this.getAllStates('YES');
    $('#addLiveModal').modal({ backdrop: 'static', keyboard: false });
    this.createLiveForm.reset();
  }

  // Function to handle image file selction event @Live Creation //
  imageInputFileAtAdd(files: FileList): void {
    this.liveImageAtCreate = null;
    this.liveImageAtCreate = files.item(0);
  }

  // Function to handle image file selction event @Live Update //
  imageInputFileAtUpdate(files: FileList): void {
    this.liveImageAtUpdate = null;
    this.liveImageAtUpdate = files.item(0);
  }

  // Create Live Function //
  createLive() {
    $('#addLiveModal').modal('hide');
    let formData = new FormData();
    formData.append('page_id', '416');
    formData.append('title', this.createLiveForm.controls['title'].value);
    formData.append('description', this.createLiveForm.controls['description'].value);
    formData.append('status', this.createLiveForm.controls['status'].value);
    if (this.createLiveForm.controls['yvideos[0][path]'].value !== null) {
      formData.append('yvideos[0][path]', this.createLiveForm.controls['yvideos[0][path]'].value);
    }
    if (this.liveImageAtCreate !== null) {
      formData.append('images[0][path]', this.liveImageAtCreate);
    }
    for (let i = 0; i < this.createLiveForm.controls['states'].value.length; i++) {
      if (this.createLiveForm.controls['states'].value[i] != '0') {
        formData.append('states[' + i + '][id]', this.createLiveForm.controls['states'].value[i]);
      }
    }
    this.liveService.saveOrUpdateLive(formData).subscribe(resp => {
      if (resp.status == 'success' && resp.status_code == 201) {
        this.successMessage = resp.message;
        $('#successMessageModal').modal('show');
        if (this.fetchLivesForm.valid) {
          this.getAllLives();
        }
      }
      else {
        this.errorMessage = resp.message;
        $('#errorMessageModal').modal('show');
      }
    });
  }

  // View Live Details Function //
  viewLiveDetails(row: any): void {
    let formData = new FormData();
    formData.append('id', row.id);
    this.liveService.getLiveDetailsById(formData).subscribe(resp => {
      if (resp.status == "success" && resp.status_code == 200) {
        this.liveDetails = resp.data;
        let selectedStates = [];
        resp.data.livestates.forEach(function (item: any) {
          selectedStates.push(parseInt(item.state_id));
        });
        this.liveDetailsForm.controls['states'].setValue(selectedStates);
        this.liveDetailsForm.setValue({
          'id': this.liveDetails.id,
          'page_id': this.liveDetails.page_id,
          'title': this.liveDetails.title,
          'description': this.liveDetails.description,
          'status': this.liveDetails.status,
          'states': selectedStates,
          'images[0][path]': [''],
          'yvideos[0][path]': null
        });
        if (this.liveDetails.yvideos.length !== 0) {
          this.liveDetailsForm.controls['yvideos[0][path]'].setValue(this.liveDetails.yvideos[0].path);
        }
        else {
          this.liveDetailsForm.controls['yvideos[0][path]'].setValue(null);
        }
        $('#viewLiveDetailsModal').modal('show');
      }
      else {
        this.errorMessage = resp.message;
        $('#errorMessageModal').modal('show');
      }
    });
  }

  // Update Live Details Function //
  updateLiveDetails(): void {
    $('#viewLiveDetailsModal').modal('hide');
    let formData = new FormData();
    formData.append('id', this.liveDetailsForm.controls['id'].value);
    formData.append('page_id', this.liveDetailsForm.controls['page_id'].value);
    formData.append('title', this.liveDetailsForm.controls['title'].value);
    formData.append('description', this.liveDetailsForm.controls['description'].value);
    formData.append('status', this.liveDetailsForm.controls['status'].value);
    if (this.liveDetailsForm.controls['yvideos[0][path]'].value !== null) {
      formData.append('yvideos[0][path]', this.liveDetailsForm.controls['yvideos[0][path]'].value);
    }
    if (this.liveImageAtUpdate !== null) {
      formData.append('images[0][path]', this.liveImageAtUpdate);
    }
    for (let i = 0; i < this.liveDetailsForm.controls['states'].value.length; i++) {
      if (this.liveDetailsForm.controls['states'].value[i] != '0') {
        formData.append('states[' + i + '][id]', this.liveDetailsForm.controls['states'].value[i]);
      }
    }
    this.liveService.saveOrUpdateLive(formData).subscribe(resp => {
      if (resp.status == 'success' && resp.status_code == 200) {
        this.successMessage = resp.message;
        $('#successMessageModal').modal('show');
        if (this.fetchLivesForm.valid) {
          this.getAllLives();
        }
      }
      else {
        this.errorMessage = resp.message;
        $('#errorMessageModal').modal('show');
      }
    });
  }

  // View Live Images Function //
  viewLiveImage(images: any[]): void {
    this.liveImagesList = images;
    $('#viewLiveImagesModal').modal('show');
  }

  // View Live Youtube Videos Function //
  viewLiveYoutubeVideos(yVideos: any[]): void {
    for (let i = 0; i < yVideos.length; i++) {
      yVideos[i].path = this.embededService.embed(yVideos[i].path);
    }
    this.liveYVideosList = yVideos;
    $('#viewLiveYVideosModal').modal('show');
  }

  // Prompt Delete Live Event Function //
  confirmDeleteLive(row: any): void {
    this.liveId = row.id;
    $('#confirmDeleteModal').modal('show');
  }

  // Delete Live Event Function //
  deleteLiveEvent(): void {
    $('#confirmDeleteModal').modal('hide');
    let formData = new FormData();
    formData.append('id', this.liveId);
    this.liveService.deleteLiveEvent(formData).subscribe(resp => {
      if (resp.status == 'success' && resp.status_code == 200) {
        this.successMessage = resp.message;
        $('#successMessageModal').modal('show');
        this.getAllLives();
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

declare interface livesListResp { }
