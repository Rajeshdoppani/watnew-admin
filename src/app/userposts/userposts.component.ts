import { Component, OnInit, ViewChild } from '@angular/core';
import { PostsService } from 'app/services/posts.service';
import { CategoryService } from 'app/services/category.service';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';
import { CheckableSettings, CheckedState } from '@progress/kendo-angular-treeview';
import { of } from 'rxjs/observable/of';
declare var $: any;

@Component({
  selector: 'app-userposts',
  templateUrl: './userposts.component.html',
  styleUrls: ['./userposts.component.css']
})
export class UserpostsComponent implements OnInit {

  // Forms Reference //
  fetchPostsForm: FormGroup;
  postDetailsForm: FormGroup;

  // Params //
  successMessage: string;
  errorMessage: string;
  postsData: any[];
  categoryData: any[];
  subCategoryData: any[];
  postImagesAtUpdate: FileList = null;
  postVideosAtUpdate: FileList = null;

  postImagesList = [];
  postVideosList = [];
  postId: string;
  imageId: string;
  videoId: string;
  format: string;
  videoFile: string;

  statusList = [
    { id: 1, name: 'Enable' },
    { id: 0, name: 'Disable' }
  ];

  // Tree View Options, Refrences && Declations //
  public checkedKeys: any[] = [];
  treeData = [];
  selectedCategories = [];
  public key = 'category_name';

  public isChecked = (dataItem: any, index: string): CheckedState => {
    if (this.containsItem(dataItem)) { return 'checked'; }
    return 'none';
  }

  public containsItem(item: any): boolean {
    return this.checkedKeys.indexOf(item[this.key]) > -1;
  }

  public hasChildren = (dataitem: any): boolean => !!dataitem.subcategories;

  public children = (dataItem: any) => of(dataItem.subcategories);

  public enableCheck = true;
  public checkChildren = true;
  public checkParents = true;
  public checkOnClick = false;
  public checkMode: any = 'multiple';
  public selectionMode: any = 'single';

  public get checkableSettings(): CheckableSettings {
    return {
      checkChildren: this.checkChildren,
      checkParents: this.checkParents,
      enabled: this.enableCheck,
      mode: this.checkMode,
      checkOnClick: this.checkOnClick
    };
  }

  // Displayd Column Name/Id's //
  displayedColumns = ['sno', 'title', 'name', 'page_header', 'page_icon', 'status', 'post_comment_status', 'actions'];
  dataSource: MatTableDataSource<postsListResp>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

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

  constructor(private postsService: PostsService, private categoryService: CategoryService, private formBuilder: FormBuilder) {

    // Fetch Posts Form Controls //
    this.fetchPostsForm = this.formBuilder.group({
      'posts[0][category_id]': [null, [Validators.required]],
      'posts[0][subcategory_id]': [null, Validators.required]
    });

    // Post Details Form Controls //
    this.postDetailsForm = this.formBuilder.group({
      'id': ['', [Validators.required]],
      'page_id': ['', [Validators.required]],
      'category_id': ['', [Validators.required]],
      'subcategory_id': null,
      'description': '',
      'title': ['', [Validators.required]],
      'tags': '',
      'name': [{ value: '', disabled: true }],
      'yvideos[0][path]': [''],
      'page_header': '',
      'page_icon': '',
      'status': ['', [Validators.required]],
      'updated_at': [{ value: '', disabled: true }],
      'created_at': [{ value: '', disabled: true }],
      'postcomment_count': '',
      'postlikes_count': '',
      'postviews_count': ''
    });

    // Get All Categories Function Invoking //
    this.getAllCategories();
    this.getpostsrecords();
  }

  // Get All Categories Function //
  getAllCategories(): void {
    this.categoryService.getAllCategories().subscribe(resp => {
      if (resp.status == 'success' && resp.status_code == 200) {
        this.categoryData = resp.data;
        for (let i = 0; i < this.categoryData.length; i++) {
          var catObj = this.categoryData[i];
          var obj = { id: catObj.id, category_name: catObj.category_name, subcategories: [] };
          for (let j = 0; j < catObj.subcategories.length; j++) {
            var subCatObj = catObj.subcategories[j];
            var subObj = { id: subCatObj.id, category_name: subCatObj.category_name }
            obj.subcategories.push(subObj);
          }
          this.treeData.push(obj);
        }
      }
      else {
        this.errorMessage = 'Failed to list categories. Please reload...!!!';
        $('#errorMessageModal').modal('show');
      }
    });
  }

  // Get Sub Categories on Category Selection Function //
  onCategoryChange(id: number): void {
    if (id != undefined) {
      var index = this.categoryData.findIndex(function (item, i) {
        return item.id == id;
      });
      this.subCategoryData = this.categoryData[index].subcategories;
      if (this.subCategoryData.length == 0) {
        this.fetchPostsForm.get('posts[0][subcategory_id]').clearValidators();
        this.fetchPostsForm.get('posts[0][subcategory_id]').updateValueAndValidity();
      }
      else {
        this.fetchPostsForm.controls['posts[0][subcategory_id]'].setValue(null);
        this.fetchPostsForm.get('posts[0][subcategory_id]').setValidators([Validators.required]);
        this.fetchPostsForm.get('posts[0][subcategory_id]').updateValueAndValidity();
      }
    }
    else {
      this.fetchPostsForm.controls['posts[0][subcategory_id]'].setErrors(null);
      this.fetchPostsForm.controls['posts[0][subcategory_id]'].setValue(null);
      this.fetchPostsForm.controls['posts[0][subcategory_id]'].setValidators([Validators.required]);
      this.fetchPostsForm.get('posts[0][subcategory_id]').updateValueAndValidity();
      this.fetchPostsForm.get('posts[0][subcategory_id]').markAsPristine();
      this.fetchPostsForm.get('posts[0][subcategory_id]').markAsUntouched();
    }
  }

  // Get All Post Function //
  getAllPosts(): void {
    const formData = new FormData();
    formData.append('posts[0][category_id]', this.fetchPostsForm.controls['posts[0][category_id]'].value);
    formData.append('posts[0][subcategory_id]', this.fetchPostsForm.controls['posts[0][subcategory_id]'].value);

    this.postsService.getAllPosts(formData).subscribe(resp => {
      if (resp.status == 'success' && resp.status_code == 200) {
        let usersPosts = resp.data.filter(post => post.rss_feed == '0');
        if (usersPosts.length == 0) {
          this.dataSource = new MatTableDataSource([]);
          this.errorMessage = 'No posts found form users for selected categories.';
          $('#errorMessageModal').modal('show');
        }
        else {
          this.dataSource = new MatTableDataSource(usersPosts);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        }
      }
      else {
        this.dataSource = new MatTableDataSource([]);
        this.errorMessage = resp.message;
        $('#errorMessageModal').modal('show');
      }
    });
  }


  getpostsrecords() {
    this.postsService.getAllPostsRecords().subscribe(resp => {
      if (resp.status == 'success' && resp.status_code == 200) {
        var finalpostsarray = [];
        for (var k = 0; k < resp.data.length; k++) {
          if (resp.data[k].rss_feed == 0) {
            finalpostsarray.push(resp.data[k]);
          }
        }
        if (finalpostsarray.length == 0) {
          this.dataSource = new MatTableDataSource([]);
          this.errorMessage = 'No posts found form users for selected categories.';
          $('#errorMessageModal').modal('show');
        }
        else {
          this.dataSource = new MatTableDataSource(finalpostsarray);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        }
      } else {
        this.dataSource = new MatTableDataSource([]);
        this.errorMessage = resp.message;
        $('#errorMessageModal').modal('show');
      }
    });
  }

  // View Post Details Function //
  viewPostDetails(row: any): void {
    (<HTMLInputElement>document.getElementById('postImagesID')).value = '';
    (<HTMLInputElement>document.getElementById('postVideosID')).value = '';
    if (row.yvideos.length != 0) {
      this.videoFile = row.yvideos[0].path;
    } else {
      this.videoFile = '';
    }
    this.postDetailsForm.setValue({
      'id': row.id,
      'page_id': row.page_id,
      'category_id': row.page.category_id,
      'subcategory_id': row.page.subcategory_id,
      'description': row.description,
      'title': row.title,
      'tags': row.tags,
      'name': row.page.name,
      'page_header': row.page.page_header,
      'page_icon': row.page.page_icon,
      'status': row.page.status,
      'yvideos[0][path]': this.videoFile,
      'updated_at': row.updated_at,
      'created_at': row.created_at,
      'postcomment_count': row.postcomment_count,
      'postlikes_count': row.postcomment_count,
      'postviews_count': row.postcomment_count
    });
    // FInding out the Selected Categories of Post by User //
    this.selectedCategories = row.postcategories;
    let commonCategories = [];
    for (let i = 0; i < this.selectedCategories.length; i++) {
      for (let j = 0; j < this.treeData.length; j++) {
        if (this.selectedCategories[i].category_id == this.treeData[j].id) {
          commonCategories.push(this.treeData[j].category_name);
        }
        for (let k = 0; k < this.treeData[j].subcategories.length; k++) {
          if (this.selectedCategories[i].subcategory_id == this.treeData[j].subcategories[k].id) {
            commonCategories.push(this.treeData[j].subcategories[k].category_name);
          }
        }
      }
    }
    this.checkedKeys = commonCategories.filter(function (item, pos) {
      return commonCategories.indexOf(item) == pos;
    });
    $('#viewPostDetailsModal').modal('show');
    $('#viewPostDetailsModal').modal({ backdrop: 'static', keyboard: false });
  }

  // View Post Images Function //
  viewPostImages(images: any[]): void {
    if (images.length == 0) {
      this.errorMessage = 'No images for the post.';
      $('#errorMessageModal').modal('show');
    }
    else {
      this.postImagesList = images;
      $('#viewPostImagesModal').modal('show');
    }
  }

  // View Post Videos Function //
  viewPostVideos(videos: any[]): void {
    if (videos.length == 0) {
      this.errorMessage = 'No videos for the post.';
      $('#errorMessageModal').modal('show');
    }
    else {
      this.postVideosList = videos;
      $('#viewPostVideosModal').modal('show');
    }
  }

  // Functions to Handling the File Input On Select @Update of RSS Post //
  imageFilesofPost(files: FileList): void {
    this.postImagesAtUpdate = null;
    this.postImagesAtUpdate = files;
  }
  videoFilesofPost(files: FileList): void {
    this.postVideosAtUpdate = null;
    this.postVideosAtUpdate = files;
  }

  // Update Post Details Function //
  updatePostDetails() {
    // Restricting the User If No Category Was Selected //
    if (this.checkedKeys.length == 0) {
      this.errorMessage = 'Select atleast 1 category or subcategory...!!!';
      $('#errorMessageModal').modal('show');
      return false;
    }
    $('#viewPostDetailsModal').modal('hide');
    // Generating the Category && SubCategory Ids based on User Selected Categories //
    var finalArray = [];
    for (let i = 0; i < this.treeData.length; i++) {
      for (let j = 0; j < this.treeData[i].subcategories.length; j++) {
        var obj = { categoryId: '', subCategoryId: '' };
        if (this.checkedKeys.includes(this.treeData[i].subcategories[j].category_name)) {
          obj.categoryId = this.treeData[i].id;
          obj.subCategoryId = this.treeData[i].subcategories[j].id;
          finalArray.push(obj);
        }
      }
    }
    let formData = new FormData();
    formData.append('id', this.postDetailsForm.controls['id'].value);
    formData.append('title', this.postDetailsForm.controls['title'].value);
    formData.append('description', this.postDetailsForm.controls['description'].value);
    formData.append('status', this.postDetailsForm.controls['status'].value);
    formData.append('yvideos[0][path]', this.postDetailsForm.controls['yvideos[0][path]'].value);
    for (let a = 0; a < finalArray.length; a++) {
      formData.append('categories[' + a + '][category_id]', finalArray[a].categoryId);
      formData.append('categories[' + a + '][subcategory_id]', finalArray[a].subCategoryId);
    }
    if (this.postImagesAtUpdate !== null) {
      for (let i = 0; i < this.postImagesAtUpdate.length; i++) {
        formData.append('images[' + i + '][path]', this.postImagesAtUpdate[i]);
      }
    }
    if (this.postVideosAtUpdate !== null) {
      for (let i = 0; i < this.postVideosAtUpdate.length; i++) {
        formData.append('videos[' + i + '][path]', this.postVideosAtUpdate[i]);
      }
    }
    // Update API Call //
    this.postsService.updatePostDetails(formData).subscribe(resp => {
      if (resp.status == 'success' && resp.status_code == 200) {
        this.successMessage = resp.message;
        $('#successMessageModal').modal('show');
        this.getAllPosts();
      }
      else {
        this.errorMessage = resp.message;
        $('#errorMessageModal').modal('show');
      }
    });
  }

  // Enable Or Disable Post Comments Function //
  enableOrDisableComments(id: any, status: any): void {
    status = status == 'false' ? 'true' : 'false';
    let formData = new FormData();
    formData.append('post_comment_status', status);
    formData.append('post_id', id);
    this.postsService.enableOrDisableComments(formData).subscribe(resp => {
      if (resp.status == 'success' && resp.status_code == 200) {
        this.successMessage = resp.message;
        $('#successMessageModal').modal('show');
        this.getAllPosts();
      }
      else {
        this.errorMessage = resp.message;
        $('#errorMessageModal').modal('show');
      }
    });
  }

  // Prompt Delete Post Function //
  confirmDelete(row: any): void {
    this.postId = row.id;
    $('#confirmDeleteModal').modal('show');
  }

  // Delete Post Function //
  deletePost(): void {
    $('#confirmDeleteModal').modal('hide');
    let formData = new FormData();
    formData.append('post_id', this.postId);
    this.postsService.deletePost(formData).subscribe(resp => {
      if (resp.status == 'success' && resp.status_code == 200) {
        this.successMessage = 'Post deleted successfully.';
        $('#successMessageModal').modal('show');
        this.getAllPosts();
      }
      else {
        this.errorMessage = resp.message;
        $('#errorMessageModal').modal('show');
      }
    });
  }

  // Prompt Delete Post Image Function //
  promptDeletePostImage(image: any): void {
    this.postId = image.post_id;
    this.imageId = image.id;
    this.format = 'image';
    $('#viewPostImagesModal').modal('hide');
    $('#confirmDeleteImageVideoModal').modal('show');
  }

  // Prompt Delete Post Video Function //
  promptDeletePostVideo(video: any): void {
    this.postId = video.post_id;
    this.imageId = video.id;
    this.format = 'video';
    $('#viewPostVideosModal').modal('hide');
    $('#confirmDeleteImageVideoModal').modal('show');
  }

  // Delete Post Image Or Video Function //
  deletePostImageOrVideo(): void {
    $('#confirmDeleteImageVideoModal').modal('hide');
    let formData = new FormData();
    formData.append('post_id', this.postId);
    formData.append('id', this.imageId);
    formData.append('format', this.format);
    this.postsService.deletePostImageOrVideo(formData).subscribe(resp => {
      if (resp.status == 'success' && resp.status_code == 200) {
        this.successMessage = 'Deleted successfully.';
        $('#successMessageModal').modal('show');
        this.getAllPosts();
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

export interface postsListResp { }
