import { Component, OnInit } from '@angular/core';
import { RolesService } from 'app/services/roles.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
declare var $: any;

@Component({
  selector: 'app-rolemanagement',
  templateUrl: './rolemanagement.component.html',
  styleUrls: ['./rolemanagement.component.css']
})
export class RolemanagementComponent implements OnInit {

  assignPrmissionForm: FormGroup
  successMessage: string;
  errorMessage: string;
  rolesList: any[];
  permissionsList: any[];

  applyFilter(filterValue) {}

  constructor(private formBuilder: FormBuilder, private rolesService: RolesService) {

    // Assign Permissions Form Controls //
    this.assignPrmissionForm = this.formBuilder.group({
      role_id: ['', Validators.required],
      permission_id: [[], Validators.required]
    });
  }

  // Get All Roles Function //
  getAllRoles(): void {
    this.rolesService.getAllRoles().subscribe(resp => {
      if (resp.status == 'success' && resp.status_code == 200) {
        this.rolesList = resp.data;
      }
      else {
        this.errorMessage = 'Failed to roles list. Please reload...!!!';
        $('#errorMessageModal').modal('show');
      }
    });
  }

  // Get All Permissions Function //
  getAllPermissions(): void {
    this.rolesService.getAllpermissions().subscribe(resp => {
      if (resp.status == 'success' && resp.status_code == 200) {
        this.permissionsList = resp.data;
      }
      else {
        this.errorMessage = 'Failed to permissions list. Please reload...!!!';
        $('#errorMessageModal').modal('show');
      }
    });
  }

  // Open Assign Permissions Modal Function //
  openRolesAssignModal(): void {
    this.assignPrmissionForm.reset();
    // Get All Roles Function Invoking //
    this.getAllRoles();

    // Get All Peermissions Function Invoking //
    this.getAllPermissions();
    $('#assignPrmissionModal').modal('show');
  }

  assignPermissions(): void {
    let formData = new FormData();
    formData.append('role_id', this.assignPrmissionForm.controls['role_id'].value);
    for (let i = 0; i < this.assignPrmissionForm.controls['permission_id'].value.length; i++) {
      formData.append('permission_id[' + i + '][id]', this.assignPrmissionForm.controls['permission_id'].value[i]);
    }
    this.rolesService.assignPermissions(formData).subscribe(resp => {
      if (resp.status == 'success' && resp.status_code == 200) {
        this.successMessage = resp.message;
        $('#successMessageModal').modal('show');
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
