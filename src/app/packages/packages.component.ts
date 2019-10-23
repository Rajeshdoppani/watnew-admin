import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { CategoryService } from 'app/services/category.service';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { PackagesService } from 'app/services/packages.service';
declare var $: any;

@Component({
  selector: 'app-packages',
  templateUrl: './packages.component.html',
  styleUrls: ['./packages.component.css']
})
export class PackagesComponent implements OnInit {

  // Forms Reference //
  addPackageForm: FormGroup;
  updatePackageForm: FormGroup;

  successMessage: string;
  errorMessage: string;
  packageId: string;

  statusList = [
    { id: 1, name: 'Enable' },
    { id: 0, name: 'Disable' }
  ];

  packageList = [
    { name: 'Basic' },
    { name: 'Premium' },
    { name: 'Standard' },
    { name: 'Gold' }
  ];

  // Displayd Column Name/Id's //
  displayedColumns = ['id', 'subscription_type', 'duration', 'description', 'amount', 'status', 'actions'];
  dataSource: MatTableDataSource<packagesListResp>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  // Applying Filter for Employees Search //
  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  constructor(private formBuilder: FormBuilder, private packageservice: PackagesService) {
    // Create Package Form Controls //
    this.addPackageForm = this.formBuilder.group({
      'subscription_type': ['', [Validators.required]],
      'duration': ['', [Validators.required]],
      'description': ['', [Validators.required]],
      'amount': ['', [Validators.required]],
      'status': ['', [Validators.required]]
    });

    // Update Package Form Controls //
    this.updatePackageForm = this.formBuilder.group({
      'subscription_type': ['', [Validators.required]],
      'duration': ['', [Validators.required]],
      'description': ['', [Validators.required]],
      'amount': ['', [Validators.required]],
      'status': ['', [Validators.required]]
    });

    this.getPackages();
  }

  // List Packages //
  getPackages() {
    this.packageservice.getpackages().subscribe(data => {
      if (data.status_code == 200) {
        this.dataSource = new MatTableDataSource(data.data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      } else {
        this.errorMessage = data.message;
        $('#errorMessageModal').modal('show');
      }
    });
  }


  // Open Package Modal //
  openCreatePackageModal() {
    $('#addPackageModal').modal('show');
    Object.keys(this.addPackageForm.controls).forEach(key => {
      this.addPackageForm.get(key).setValue('');
      this.addPackageForm.get(key).markAsPristine();
      this.addPackageForm.get(key).markAsUntouched();
      this.addPackageForm.get(key).updateValueAndValidity();
    });
  }


  // Add Packages //
  addPackage() {
    $('#addPackageModal').modal('hide');
    const formData = new FormData();
    formData.append('subscription_type', this.addPackageForm.controls['subscription_type'].value);
    formData.append('duration', this.addPackageForm.controls['duration'].value);
    formData.append('description', this.addPackageForm.controls['description'].value);
    formData.append('amount', this.addPackageForm.controls['amount'].value);
    formData.append('status', this.addPackageForm.controls['status'].value);
    this.packageservice.createPackage(formData).subscribe(data => {
      if (data.status == 'success' && data.status_code == 201) {
        this.successMessage = data.message;
        $('#successMessageModal').modal('show');
        this.getPackages();
      }
      else {
        this.errorMessage = data.message;
        $('#errorMessageModal').modal('show');
      }
    });
  }


  // Open View & Update Modal //
  viewpackageDetails(row) {
    this.updatePackageForm.setValue({
      subscription_type: row.subscription_type,
      duration: row.duration,
      description: row.description,
      amount: row.amount,
      status: row.status
    });
    this.packageId = row.id;
    $('#viewPackageModal').modal('show');
  }

  // Update Package //
  updatePackage() {
    $('#viewPackageModal').modal('hide');
    const formData = new FormData();
    formData.append('subscription_type', this.updatePackageForm.controls['subscription_type'].value);
    formData.append('duration', this.updatePackageForm.controls['duration'].value);
    formData.append('description', this.updatePackageForm.controls['description'].value);
    formData.append('amount', this.updatePackageForm.controls['amount'].value);
    formData.append('status', this.updatePackageForm.controls['status'].value);
    formData.append('id', this.packageId);
    this.packageservice.updatePackage(formData).subscribe(data => {
      if (data.status == 'success' && data.status_code == 200) {
        this.successMessage = data.message;
        $('#successMessageModal').modal('show');
        this.getPackages();
      }
      else {
        this.errorMessage = data.message;
        $('#errorMessageModal').modal('show');
      }
    });
  }

  // Delete Package Modal //
  confirmDeletePackage(row) {
    this.packageId = row.id;
    $('#confirmDeleteModal').modal('show');
  }

  // Delete Package //
  deletePackage() {
    $('#confirmDeleteModal').modal('hide');
    const formData = new FormData();
    formData.append('id', this.packageId);
    this.packageservice.deletePackage(formData).subscribe(data => {
      if (data.status == 'success' && data.status_code == 200) {
        this.successMessage = data.message;
        $('#successMessageModal').modal('show');
        this.getPackages();
      } else {
        this.errorMessage = data.message;
        $('#errorMessageModal').modal('show');
      }
    });
  }


  ngOnInit() {
  }

}
export interface packagesListResp {
  id: number;
  subscription_type: string;
  duration: string;
  description: string;
  amount: number;
  status: number;
}
