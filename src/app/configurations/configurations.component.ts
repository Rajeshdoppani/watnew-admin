import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfigurationsService } from 'app/services/configurations.service';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
declare var $: any;

@Component({
  selector: 'app-configurations',
  templateUrl: './configurations.component.html',
  styleUrls: ['./configurations.component.css']
})
export class ConfigurationsComponent implements OnInit {

  errorMessage: string;
  successMessage: string;
  referTimeDetailsForm: FormGroup;
  addConfigDetailsForm: FormGroup;
  usageTimeDetailsForm: FormGroup;
  scratchCardsStatusForm: FormGroup;
  confData: any[];

  statusList = [
    { id: 1, name: 'Enable' },
    { id: 0, name: 'Disable' }
  ];

  // Displayd Column Name/Id's //
  displayedColumns = ['sno', 'type', 'min_amount', 'max_amount', 'adds_position', 'duration', 'status', 'actions'];
  dataSource: MatTableDataSource<configsResp>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  // Applying Filter for Employees Search //
  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  constructor(private formBuilder: FormBuilder, private configService: ConfigurationsService) {

    // Configurations Details Form Controls //
    this.referTimeDetailsForm = this.formBuilder.group({
      id: ['', Validators.required],
      type: [{ value: '', disabled: true }, Validators.required],
      min_amount: ['', Validators.required],
      max_amount: ['', Validators.required],
      status: ['', Validators.required]
    });

    // Configurations Details Form Controls //
    this.addConfigDetailsForm = this.formBuilder.group({
      id: ['', Validators.required],
      type: [{ value: '', disabled: true }, Validators.required],
      adds_position: ['', Validators.required],
      status: ['', Validators.required]
    });

    // Configurations Details Form Controls //
    this.usageTimeDetailsForm = this.formBuilder.group({
      id: ['', Validators.required],
      type: [{ value: '', disabled: true }, Validators.required],
      duration: ['', Validators.required],
      status: ['', Validators.required]
    });

    // Scratch Cards Status Form Controls //
    this.scratchCardsStatusForm = this.formBuilder.group({
      id: ['', Validators.required],
      type: [{ value: '', disabled: true }, Validators.required],
      status: ['', Validators.required]
    });

    // Get All Configurations Function Invoking //
    this.getAllConfigurations();
  }

  // Get All Configurations Function //
  getAllConfigurations(): void {
    this.configService.getAllSystemConfigurations().subscribe(resp => {
      if (resp.status == 'success' && resp.status_code == 200) {
        this.confData = resp.data;
        this.dataSource = new MatTableDataSource(resp.data);
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

  // View Configuration Details Based On Config Type Function //
  viewConfigDetails(row: configsResp): void {
    if (row.type == 'Refer Friend' || row.type == 'Time Spend Amount' || row.type == 'Merchant Post Reward') {
      this.referTimeDetailsForm.setValue({
        id: row.id,
        type: row.type,
        min_amount: row.min_amount,
        max_amount: row.max_amount,
        status: row.status
      });
      $('#referTimeDetailsModal').modal('show');
    }
    else if (row.type == 'Post Adds' || row.type == 'Live Adds') {
      this.addConfigDetailsForm.setValue({
        id: row.id,
        type: row.type,
        adds_position: row.adds_position,
        status: row.status
      });
      $('#addConfigDetailsModal').modal('show');
    }
    else if (row.type == 'Scratch Card Status') {
      this.scratchCardsStatusForm.setValue({
        id: row.id,
        type: row.type,
        status: row.status
      });
      $('#scratchCardStatusModal').modal('show');
    }
    else {
      this.usageTimeDetailsForm.setValue({
        id: row.id,
        type: row.type,
        duration: row.duration,
        status: row.status
      });
      $('#usageTimeDetailsModal').modal('show');
    }
  }

  // Update Refer & Time Details Function //
  updateReferTimeDetails(): void {
    if (parseInt(this.referTimeDetailsForm.controls['min_amount'].value) >= parseInt(this.referTimeDetailsForm.controls['max_amount'].value)) {
      this.errorMessage = 'Min amount should be lessthan Max amount.';
      $('#errorMessageModal').modal('show');
      return;
    }
    $('#referTimeDetailsModal').modal('hide');
    let formData = new FormData();
    formData.append('id', this.referTimeDetailsForm.controls['id'].value);
    formData.append('min_amount', this.referTimeDetailsForm.controls['min_amount'].value);
    formData.append('max_amount', this.referTimeDetailsForm.controls['max_amount'].value);
    formData.append('status', this.referTimeDetailsForm.controls['status'].value);
    this.configService.updateSystemConfigurations(formData).subscribe(resp => {
      this.getUpdatedStatus(resp);
    });
  }

  // Update Add Config Details Function //
  updateaddConfigDetails(): void {
    $('#addConfigDetailsModal').modal('hide');
    let formData = new FormData();
    formData.append('id', this.addConfigDetailsForm.controls['id'].value);
    formData.append('adds_position', this.addConfigDetailsForm.controls['adds_position'].value);
    formData.append('status', this.addConfigDetailsForm.controls['status'].value);
    this.configService.updateSystemConfigurations(formData).subscribe(resp => {
      this.getUpdatedStatus(resp);
    });
  }

  // Update Usage Time Details Function //
  updateUsageTimeDetails(): void {
    $('#usageTimeDetailsModal').modal('hide');
    let formData = new FormData();
    formData.append('id', this.usageTimeDetailsForm.controls['id'].value);
    formData.append('duration', this.usageTimeDetailsForm.controls['duration'].value);
    formData.append('status', this.usageTimeDetailsForm.controls['status'].value);
    this.configService.updateSystemConfigurations(formData).subscribe(resp => {
      this.getUpdatedStatus(resp);
    });
  }

  // Update Scratch Cards Status Function //
  updateScratchCardStatusDetails(): void {
    $('#scratchCardStatusModal').modal('hide');
    let formData = new FormData();
    formData.append('id', this.scratchCardsStatusForm.controls['id'].value);
    formData.append('status', this.scratchCardsStatusForm.controls['status'].value);
    this.configService.updateSystemConfigurations(formData).subscribe(resp => {
      this.getUpdatedStatus(resp);
    });
  }

  // Get Status After Updating Configuration Function //
  getUpdatedStatus(resp: any): void {
    if (resp.status == 'success' && resp.status_code == 200) {
      this.successMessage = resp.message;
      this.getAllConfigurations();
      $('#successMessageModal').modal('show');
    }
    else {
      this.errorMessage = resp.message;
      $('#errorMessageModal').modal('show');
    }
  }

  ngOnInit() { }

}

declare interface configsResp {
  id: number,
  min_amount: string,
  max_amount: string,
  type: string,
  adds_position: string,
  duration: string,
  status: number
}