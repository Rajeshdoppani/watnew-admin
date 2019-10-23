import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PostsService } from 'app/services/posts.service';
import { CategoryService } from 'app/services/category.service';
import { CheckableSettings, CheckedState } from '@progress/kendo-angular-treeview';
import { of } from 'rxjs/observable/of';
declare var $: any;

@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.css']
})
export class CreatePostComponent implements OnInit {
  createPostForm: FormGroup;
  categoriesList: any[];
  successMessage: string;
  errorMessage: string;
  postImages: FileList = null;
  postVideos: FileList = null;

  settings = {
    bigBanner: true,
    timePicker: true,
    format: 'dd-MM-yyyy HH:mm:ss',
    defaultOpen: false
  }

  // Tree View Options, Refrences && Declations //
  public checkedKeys: any[] = [];
  treeData = [];
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

  constructor(private formBuilder: FormBuilder, private postsService: PostsService, private categoriesService: CategoryService) {
    // Create Post Form Controls //
    this.createPostForm = this.formBuilder.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      page_id: ['412'],
      schedule_at: [new Date()],
      category: [''],
      sub_category: [''],
      post_images: ['', Validators.required],
      post_videos: [''],
      externallink: [''],
    });

    // Get All Categories Function Invoking //
    this.getAllCategories();
  }

  // Get All Categories Function //
  getAllCategories(): void {
    this.categoriesService.getAllCategories().subscribe(resp => {
      if (resp.status == 'success' && resp.status_code == 200) {
        this.categoriesList = resp.data;
        for (let i = 0; i < this.categoriesList.length; i++) {
          var catObj = this.categoriesList[i];
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

  postImagesAtAdd(files: FileList): void {
    this.postImages = files;
  }
  postVideosAtAdd(files: FileList): void {
    this.postVideos = files;
  }

  // Create Post Function //
  createPost() {
    // Restricting the User If No Category Was Selected //
    if(this.checkedKeys.length == 0) {
      this.errorMessage = 'Select atleast 1 category or subcategory...!!!';
      $('#errorMessageModal').modal('show');
      return false;
    }

    // Generating the Category && SubCategory Ids based on User Selected Categories //
    var finalArray = [];
    for (let i = 0; i < this.categoriesList.length; i++) {
      for (let j = 0; j < this.categoriesList[i].subcategories.length; j++) {
        var obj = { categoryId: '', subCategoryId: ''};
        if (this.checkedKeys.includes(this.categoriesList[i].subcategories[j].category_name)) {
          obj.categoryId = this.categoriesList[i].id;
          obj.subCategoryId = this.categoriesList[i].subcategories[j].id;
          finalArray.push(obj);
        }
      }
    }

    // Getting the Date in Required Format(YYYY-MM-DD HH:mm:ss) //
    let date = JSON.stringify(new Date(this.createPostForm.controls['schedule_at'].value));
    let scheduleDate = date.slice(1, 11) + ' ' + date.slice(12, 20);

    // Generating the FormData //
    let formData = new FormData();
    formData.append('page_id', this.createPostForm.controls['page_id'].value);
    formData.append('title', this.createPostForm.controls['title'].value);
    formData.append('description', this.createPostForm.controls['description'].value);
    if(this.createPostForm.controls['externallink'].value !== '') {
      formData.append('yvideos[0][path]', this.createPostForm.controls['externallink'].value);
    }
    formData.append('status', '1');
    formData.append('schedule_at', scheduleDate);
    for (let a =0; a < finalArray.length; a++) {
      formData.append('categories['+ a +'][category_id]', finalArray[a].categoryId);
      formData.append('categories['+ a +'][subcategory_id]', finalArray[a].subCategoryId);
    }
    if(this.postImages !== null) {
      for (let i = 0; i < this.postImages.length; i++) {
        formData.append('images[' + i + '][path]', this.postImages[i]);
      }
    }
    if(this.postVideos !== null) {
      for (let i = 0; i < this.postVideos.length; i++) {
        formData.append('videos[' + i + '][path]', this.postVideos[i]);
      }
    }
    this.postsService.createPost(formData).subscribe(resp => {
      if(resp.status == 'success' && resp.status_code == 201) {
        this.successMessage = resp.message;
        $('#successMessageModal').modal('show');
        this.checkedKeys = [];
        this.createPostForm.reset();
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
