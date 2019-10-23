import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { CategoryService } from 'app/services/category.service';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { MembersService } from 'app/services/members.service';
declare var $: any;

@Component({
  selector: 'app-members',
  templateUrl: './members.component.html',
  styleUrls: ['./members.component.css']
})
export class MembersComponent implements OnInit {
  // Forms Reference //
  addmemberForm: FormGroup;
  updatememberForm: FormGroup;

  successMessage: string;
  errorMessage: string;
  memberID: string;

  statusList = [
    { id: 1, name: 'Enable' },
    { id: 0, name: 'Disable' }
  ];

  packageList: any;

  // Displayd Column Name/Id's //
  displayedColumns = ['id', 'user_subscription_type', 'name', 'email', 'mobile', 'status', 'actions'];
  dataSource: MatTableDataSource<memberListResp>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  // Applying Filter for Employees Search //
  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }
  constructor(private formBuilder: FormBuilder, private memberservice: MembersService) {
    this.addmemberForm = this.formBuilder.group({
      'package_id': ['', [Validators.required]],
      'name': ['', [Validators.required]],
      'email': ['', [Validators.required]],
      'company_name': ['', [Validators.required]],
      'mobile': ['', [Validators.required]],
      'company_url': ['', null],
      'status': ['', [Validators.required]]
    });

    this.updatememberForm = this.formBuilder.group({
      'package_id': ['', [Validators.required]],
      'name': ['', [Validators.required]],
      'email': ['', [Validators.required]],
      'company_name': ['', [Validators.required]],
      'mobile': ['', [Validators.required]],
      'company_url': ['', null],
      'status': ['', [Validators.required]]
    });

    this.getMembers();
  }

  // Get Packages //
  getPackages() {
    this.memberservice.getpackages().subscribe(data => {
      if (data.status_code == 200) {
        this.packageList = data.data;
      } else {
        this.errorMessage = data.message;
        $('#errorMessageModal').modal('show');
      }
    });
  }

  // List Members //
  getMembers() {
    this.memberservice.getmembers().subscribe(data => {
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

  // open member modal //
  openCreateMemberModal() {
    this.getPackages();
    $('#addMemberModal').modal('show');
    Object.keys(this.addmemberForm.controls).forEach(key => {
      this.addmemberForm.get(key).setValue('');
      this.addmemberForm.get(key).markAsPristine();
      this.addmemberForm.get(key).markAsUntouched();
      this.addmemberForm.get(key).updateValueAndValidity();
    });
  }


  // Add Member //
  addMember() {
    $('#addMemberModal').modal('hide');
    const formData = new FormData();
    formData.append('package_id', this.addmemberForm.controls['package_id'].value);
    formData.append('name', this.addmemberForm.controls['name'].value);
    formData.append('email', this.addmemberForm.controls['email'].value);
    formData.append('mobile', this.addmemberForm.controls['mobile'].value);
    formData.append('company_name', this.addmemberForm.controls['company_name'].value);
    formData.append('company_url', this.addmemberForm.controls['company_url'].value);
    formData.append('status', this.addmemberForm.controls['status'].value);
    this.memberservice.createMember(formData).subscribe(data => {
      if (data.status == 'success' && data.status_code == 201) {
        this.successMessage = data.message;
        $('#successMessageModal').modal('show');
        this.getMembers();
      }
      else {
        this.errorMessage = data.message;
        $('#errorMessageModal').modal('show');
      }
    });
  }

  // Open View/Update Modal //
  viewmemberDetails(row) {
    this.getPackages();
    this.updatememberForm.setValue({
      package_id: row.package_id,
      name: row.name,
      email: row.email,
      mobile: row.mobile,
      company_name: row.company_name,
      company_url: row.company_url,
      status: row.status
    });
    this.memberID = row.id;
    $('#viewMemberModal').modal('show');
  }

  // Update member //
  updateMember() {
    $('#viewMemberModal').modal('hide');
    const formData = new FormData();
    formData.append('package_id', this.updatememberForm.controls['package_id'].value);
    formData.append('name', this.updatememberForm.controls['name'].value);
    formData.append('email', this.updatememberForm.controls['email'].value);
    formData.append('mobile', this.updatememberForm.controls['mobile'].value);
    formData.append('company_name', this.updatememberForm.controls['company_name'].value);
    formData.append('company_url', this.updatememberForm.controls['company_url'].value);
    formData.append('status', this.updatememberForm.controls['status'].value);
    formData.append('id', this.memberID);
    this.memberservice.updatemember(formData).subscribe(data => {
      if (data.status == 'success' && data.status_code == 200) {
        this.successMessage = data.message;
        $('#successMessageModal').modal('show');
        this.getMembers();
      }
      else {
        this.errorMessage = data.message;
        $('#errorMessageModal').modal('show');
      }
    });
  }


  ngOnInit() {
  }

}

export interface memberListResp {
  id: number;
  user_subscription_type: string;
  name: string;
  email: string;
  mobile: number;
  status: number;
}
