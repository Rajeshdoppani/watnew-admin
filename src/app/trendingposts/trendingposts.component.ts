import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { CategoryService } from 'app/services/category.service';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { PostsService } from 'app/services/posts.service';
import { DomSanitizer } from '@angular/platform-browser';
declare var $: any;

@Component({
  selector: 'app-trendingposts',
  templateUrl: './trendingposts.component.html',
  styleUrls: ['./trendingposts.component.css']
})
export class TrendingpostsComponent implements OnInit {

  successMessage: string;
  errorMessage: string;
  postDetailsForm: FormGroup;
  postImagesList = [];
  postVideosList = [];

  statusList = [
    { id: 1, name: 'Enable' },
    { id: 0, name: 'Disable' }
  ];

  // Displayd Column Name/Id's //
  displayedColumns = ['sno', 'title', 'status', 'postlikes_count', 'postviews_count', 'postcomment_count', 'actions'];
  dataSource: MatTableDataSource<trendPostListResp>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  // Applying Filter for Employees Search //
  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  constructor(private formBuilder: FormBuilder, private postsService: PostsService, private domSanitizer: DomSanitizer) {

    // Post Details Form Controls //
    this.postDetailsForm = this.formBuilder.group({
      'id': ['', [Validators.required]],
      'description': ['', [Validators.required]],
      'title': ['', [Validators.required]],
      'tags': ['', [Validators.required]],
      'name': ['', [Validators.required]],
      'page_header': ['', [Validators.required]],
      'page_icon': ['', [Validators.required]],
      'status': ['', [Validators.required]],
      'updated_at': [{ value: '', disabled: true }, [Validators.required]],
      'created_at': [{ value: '', disabled: true }, [Validators.required]],
      'postcomment_count': ['', [Validators.required]],
      'postlikes_count': ['', [Validators.required]],
      'postviews_count': ['', [Validators.required]]
    });

    // Get All Trending Posts Invoking //
    this.getAllTrendingPosts();
  }

  // Get All Trending Posts Function //
  getAllTrendingPosts(): void {
    this.postsService.getAllTrendingPosts().subscribe(resp => {
      if (resp.status == "success" && resp.status_code == 200) {
        this.dataSource = new MatTableDataSource(resp.posts);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
      else {
        this.dataSource = new MatTableDataSource([]);
        this.errorMessage = 'Failed to list trending posts. Please reload...!!!';
        $('#errorMessageModal').modal('show');
      }
    });
  }

  // View trending Post Details Function //
  viewTrendPostDetails(row: any): void {
    this.postDetailsForm.setValue({
      'id': row.id,
      'description': row.description,
      'title': row.title,
      'tags': row.tags,
      'name': row.page.name,
      'page_header': row.page.page_header,
      'page_icon': row.page.page_icon,
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
  viewTrendPostImages(images: any[]): void {
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
  viewTrendPostVideos(videos: any[]): void {
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

  ngOnInit() {
  }

}

export interface trendPostListResp {
  id: string;
  title: string;
  tags: string;
  description: string;
  status: string;
  postlikes_count: string;
  postviews_count: string;
  postcomment_count: string;
}
