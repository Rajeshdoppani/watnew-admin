import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { UsersService } from 'app/services/users.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
declare var $: any;

@Component({
  selector: 'app-registeredusers',
  templateUrl: './registeredusers.component.html',
  styleUrls: ['./registeredusers.component.css']
})
export class RegisteredusersComponent implements OnInit {

  userDetailsForm: FormGroup;

  successMessage: string;
  errorMessage: string;
  userId: string;

  // Displayd Column Name/Id's //
  displayedColumns = ['sno', 'nick_name', 'email', 'mobile', 'verified', 'source_type', 'created_at', 'actions'];
  dataSource: MatTableDataSource<usersListResp>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  // Applying Filter for Employees Search //
  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  constructor(private usersService: UsersService, private formBuilder: FormBuilder) {

    // User Details View Form Controls // 
    this.userDetailsForm = this.formBuilder.group({
      'nick_name': [{ value: '', disabled: true }, Validators.required],
      'email': [{ value: '', disabled: true }, Validators.required],
      'mobile': [{ value: '', disabled: true }, Validators.required],
      'created_at': [{ value: '', disabled: true }, Validators.required],
      'source_type': [{ value: '', disabled: true }, Validators.required]
    });

    // Get All Users Funnction Invoking //
    this.getAllUsers();
  }

  // Get All Users Function //
  getAllUsers(): void {
    this.usersService.getAllUsers().subscribe(resp => {
      if (resp.status == 'success' && resp.status_code == 200) {
        this.dataSource = new MatTableDataSource(resp.data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
      else {
        this.dataSource = new MatTableDataSource([]);
        this.errorMessage = 'Failed to list users. Please reload...!!!';
        $('#errorMessageModal').modal('show');
      }
    });
  }

  // View User Details Function //
  viewUserDetails(row: any): void {
    this.userDetailsForm.setValue({
      nick_name: row.nick_name,
      email: row.email,
      mobile: row.mobile,
      source_type: row.source_type,
      created_at: row.created_at,
    });
    $('#viewUserModal').modal('show');
  }

  // Confirm Delete Prompt Function //
  confirmDeleteUser(row: any): void {
    this.userId = row.id;
    $('#confirmDeleteModal').modal('show');
  }

  // Delete User Function //
  deleteUser(): void {
    $('#confirmDeleteModal').modal('hide');
    let userDeleteFormData = new FormData();
    userDeleteFormData.append('id', this.userId);

    this.usersService.deleteUser(userDeleteFormData).subscribe(resp => {
      if (resp.status == 'success' && resp.status_code == 200) {
        this.successMessage = 'User deleted successfully.';
        $('#successMessageModal').modal('show');
        this.getAllUsers();
      }
      else {
        this.errorMessage = 'Error while deleting user. Try again...!!!';
        $('#errorMessageModal').modal('show');
      }
    });
  }

  ngOnInit() {
  }

}
export interface usersListResp {
  nick_name: string;
  email: string;
  mobile: string;
  created_at: string;
  verified: string;
  source_type: string;
}
