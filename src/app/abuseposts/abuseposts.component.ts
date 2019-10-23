import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PostsService } from 'app/services/posts.service';
declare var $: any;

@Component({
  selector: 'app-abuseposts',
  templateUrl: './abuseposts.component.html',
  styleUrls: ['./abuseposts.component.css']
})
export class AbusepostsComponent implements OnInit {

  errorMessage: string;
  successMessage: string;
  abusedPostId: string;
  abusedPostDetailsForm: FormGroup;
  reasonsList: any[];

  // Displayd Column Name/Id's //
  displayedColumns = ['sno', 'user_name', 'mobile', 'category_name', 'post_title', 'created_at', 'updated_at', 'actions'];
  dataSource: MatTableDataSource<abusedPostsListResp>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  // Applying Filter for Employees Search //
  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  constructor(private formBuilder: FormBuilder, private postsService: PostsService) {

    // Get All Abused Posts Function Invoking //
    this.getAllAbusedPosts();

    // Abused Post Details Form Controls //
    this.abusedPostDetailsForm = this.formBuilder.group({
      id: [{ value: '', disabled: true }, Validators.required],
      post_id: [{ value: '', disabled: true }, Validators.required],
      post_title: ['', Validators.required],
      message: ['', Validators.required],
      user_name: [{ value: '', disabled: true }, Validators.required],
      user_id: [{ value: '', disabled: true }, Validators.required],
      reason_id: [{ value: '', disabled: true }, Validators.required],
      category_id: [{ value: '', disabled: true }, Validators.required],
      category_name: [{ value: '', disabled: true }, Validators.required],
      created_at: [{ value: '', disabled: true }, Validators.required],
      updated_at: [{ value: '', disabled: true }, Validators.required],
      mobile: [{ value: '', disabled: true }, Validators.required]
    });
  }

  // Get All Abused Posts Function // 
  getAllAbusedPosts(): void {
    this.postsService.getAllAbusePosts().subscribe(resp => {
      if (resp.status == 'success' && resp.status_code == 200) {
        this.dataSource = new MatTableDataSource(resp.data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
      else {
        this.dataSource = new MatTableDataSource([]);
        this.errorMessage = 'Failed to list abused posts. Try again...!!!';
        $('#errorMessageModal').modal('show');
      }
    });
  }

  // View Abused Post Details Function //
  viewAbusedPostDetails(row: any): void {
    this.getAllAbusePostReaseons();
    this.abusedPostDetailsForm.setValue({
      id: row.id,
      post_id: row.post_id,
      post_title: row.post_title,
      message: row.message,
      user_name: row.user.nick_name,
      user_id: row.user_id,
      mobile: row.user.mobile,
      category_id: row.category_id,
      reason_id: parseInt(row.reason_id),
      category_name: row.category_name.category_name,
      created_at: row.created_at,
      updated_at: row.updated_at
    });
    $('#viewAbusedPostDetailsModal').modal('show');
  }

  // Update Abused Post Details Function //
  updateAbusedPostDetails(): void {
    $('#viewAbusedPostDetailsModal').modal('hide');
    let formData = new FormData();
    formData.append('post_id', this.abusedPostDetailsForm.controls['post_id'].value);
    formData.append('post_title', this.abusedPostDetailsForm.controls['post_title'].value);
    formData.append('category_id', this.abusedPostDetailsForm.controls['category_id'].value);
    formData.append('message', this.abusedPostDetailsForm.controls['message'].value);
    this.postsService.updateAbusedPost(formData).subscribe(resp => {
      if (resp.status == 'success' && resp.status_code == 200) {
        // Calling All Get All Abused Posts Function //
        this.getAllAbusedPosts();
        this.successMessage = 'Abused post updated successfully.';
        $('#successMessageModal').modal('show');
      }
      else {
        this.errorMessage = 'Error while updating abused post. Try Again.';
        $('#errorMessageModal').modal('show');
      }
    });
  }

  // Prompt Delete Abused Post Function //
  confirmDeletePost(row: any) {
    this.abusedPostId = row.post_id;
    $('#confirmDeleteModal').modal('show');
  }

  // Delete Abused Post Function //
  deleteAbusedPost(): void {
    $('#confirmDeleteModal').modal('hide');
    let formData = new FormData();
    formData.append('post_id', this.abusedPostId);
    this.postsService.deletePost(formData).subscribe(resp => {
      if (resp.status == 'success' && resp.status_code == 200) {
        // Calling All Get All Abused Posts Function //
        this.getAllAbusedPosts();
        this.successMessage = 'Abused post deleted successfully.';
        $('#successMessageModal').modal('show');
      }
      else {
        this.errorMessage = resp.message;
        $('#errorMessageModal').modal('show');
      }
    });
  }

  // Get All Abuse Post Reasons API //
  getAllAbusePostReaseons() {
    this.postsService.getAllAbusePostReasons().subscribe(resp => {
      if (resp.status == 'success' && resp.status_code == 200) {
        this.reasonsList = resp.data;
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

export interface abusedPostsListResp {
  id: string;
  post_id: string;
  post_title: string;
  message: string;
  user: any;
  user_id: string;
  category_id: string;
  category_name: any;
  created_at: string;
  updated_at: string;
}
