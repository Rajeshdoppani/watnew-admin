import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CategoryService } from 'app/services/category.service';
import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';
import { PostsService } from 'app/services/posts.service';
import { DomSanitizer } from '@angular/platform-browser';
declare var $: any;

@Component({
  selector: 'app-rssposts',
  templateUrl: './rssposts.component.html',
  styleUrls: ['./rssposts.component.css']
})
export class RsspostsComponent implements OnInit {

  // Forms Reference //
  fetchPostsForm: FormGroup;
  postDetailsForm: FormGroup;

  // Params //
  successMessage: string;
  errorMessage: string;
  postsData: any[];
  categoryData: any[];
  subCategoryData: any[];

  postImagesList = [];
  postVideosList = [];
  postId: string;
  imageId: string;
  format: string;
  postImagesAtUpdate: FileList = null;
  postVideosAtUpdate: FileList = null;

  statusList = [
    { id: 1, name: 'Enable' },
    { id: 0, name: 'Disable' }
  ];

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

  constructor(private formBuilder: FormBuilder, private categoryService: CategoryService, private postsService: PostsService, private domSanitizer: DomSanitizer) {
    // Fetch Posts Form Controls //
    this.fetchPostsForm = this.formBuilder.group({
      'posts[0][category_id]': [null, [Validators.required]],
      'posts[0][subcategory_id]': [null, Validators.required]
    });

    this.postDetailsForm = this.formBuilder.group({
      'id': ['', [Validators.required]],
      'description': ['', [Validators.required]],
      'title': ['', [Validators.required]],
      'tags': ['', [Validators.required]],
      'name': ['', [Validators.required]],
      'page_header': ['', [Validators.required]],
      'category_id': ['', [Validators.required]],
      'subcategory_id': ['', [Validators.required]],
      'page_icon': ['', [Validators.required]],
      'status': ['', [Validators.required]],
      'updated_at': [{ value: '', disabled: true }, [Validators.required]],
      'created_at': [{ value: '', disabled: true }, [Validators.required]],
      'postcomment_count': ['', [Validators.required]],
      'postlikes_count': ['', [Validators.required]],
      'postviews_count': ['', [Validators.required]]
    });

    // Get All Categories Function Invoking //
    this.getAllCategories();
    this.getrssposts();
  }

  // Get All Categories Function //
  getAllCategories(): void {
    this.categoryService.getAllCategories().subscribe(resp => {
      if (resp.status == 'success' && resp.status_code == 200) {
        this.categoryData = resp.data;
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
        let rssPosts = resp.data.filter(post => post.rss_feed == '1');
        if (rssPosts.length == 0) {
          this.dataSource = new MatTableDataSource([]);
          this.errorMessage = 'No posts found for selected categories.';
          $('#errorMessageModal').modal('show');
        }
        else {
          this.dataSource = new MatTableDataSource(rssPosts);
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

  getrssposts(){
    this.postsService.getRSSPostsRecords().subscribe(resp => {
      if (resp.status == 'success' && resp.status_code == 200) {
        var finalrsspostsarray = [];
        for (var k = 0; k < resp.data.length; k++) {
          if (resp.data[k].rss_feed == 1) {
            finalrsspostsarray.push(resp.data[k]);
          }
        }
        if (finalrsspostsarray.length == 0) {
          this.dataSource = new MatTableDataSource([]);
          this.errorMessage = 'No posts found form users for selected categories.';
          $('#errorMessageModal').modal('show');
        }
        else {
          this.dataSource = new MatTableDataSource(finalrsspostsarray);
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
    this.postDetailsForm.setValue({
      'id': row.id,
      'description': row.description,
      'title': row.title,
      'tags': row.tags,
      'name': row.page.name,
      'page_header': row.page.page_header,
      'page_icon': row.page.page_icon,
      'category_id': row.page.category_id,
      'subcategory_id': row.page.subcategory_id,
      'status': row.page.status,
      'updated_at': row.updated_at,
      'created_at': row.created_at,
      'postcomment_count': row.postcomment_count,
      'postlikes_count': row.postcomment_count,
      'postviews_count': row.postcomment_count
    });
    $('#viewPostDetailsModal').modal('show');
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
      for (let i = 0; i < videos.length; i++) {
        var pattern = new RegExp('(?:<iframe[^>]*)(?:(?:\/>)|(?:>.*?<\/iframe>))'); // fragment locator
        let video = videos[i];
        let status = pattern.test(videos[i].path);
        if (status == true) {
          video.status = 'true';
          var res = videos[i].path.replace("'\'", "");
          var regEx = /(width|height)=["']([^"']*)["']/gi;
          var resconvert = res.replace(regEx);
          var result = resconvert.replace('undefined undefined', 'width="250" height="200"');
          videos[i].path = this.domSanitizer.bypassSecurityTrustHtml(result);
        } else {
          video.status = 'false';
          videos[i].path = videos[i].path;
        }
      }
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
  updatePostDetails(): void {
    $('#viewPostDetailsModal').modal('hide');
    let formData = new FormData();
    formData.append('id', this.postDetailsForm.controls['id'].value);
    formData.append('title', this.postDetailsForm.controls['title'].value);
    formData.append('description', this.postDetailsForm.controls['description'].value);
    formData.append('status', this.postDetailsForm.controls['status'].value);
    formData.append('categories[0][category_id]', this.postDetailsForm.controls['category_id'].value);
    formData.append('categories[0][subcategory_id]', this.postDetailsForm.controls['subcategory_id'].value);
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

export interface postsListResp {

}
