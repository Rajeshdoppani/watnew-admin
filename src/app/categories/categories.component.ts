import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { CategoryService } from 'app/services/category.service';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
declare var $: any;

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit {

  // Forms Reference //
  addCategoryForm: FormGroup;
  updateCategoryForm: FormGroup;

  // Files Info //
  fileToUpload: File = null;
  fileToUpdate: File = null;

  successMessage: string;
  errorMessage: string;
  imagePath: string;
  categoryId: string;

  statusList = [
    { id: 1, name: 'Enable' },
    { id: 0, name: 'Disable' }
  ];

  // Displayd Column Name/Id's //
  displayedColumns = ['sno', 'category_name', 'image', 'status', 'comments', 'subcategories', 'actions'];
  dataSource: MatTableDataSource<catagoryListResp>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  // Applying Filter for Employees Search //
  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  constructor(private formBuilder: FormBuilder, private categoryService: CategoryService) {
    // Create Category Form Controls //
    this.addCategoryForm = this.formBuilder.group({
      'category_name': ['', [Validators.required]],
      'status': ['', [Validators.required]]
    });

    // View or Update Category Form Controls //
    this.updateCategoryForm = this.formBuilder.group({
      'category_name': ['', [Validators.required]],
      'status': ['', [Validators.required]]
    })

    this.getAllCategories();
  }

  // Get All Categories Function //
  getAllCategories() {
    this.categoryService.getAllCategories().subscribe(resp => {
      if (resp.status == 'success' && resp.status_code == 200) {
        this.dataSource = new MatTableDataSource(resp.data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
      else {
        this.errorMessage = 'Failed to list categories. Please reload...!!!';
        $('#errorMessageModal').modal('show');
      }
    });
  };

  // Open Create Category Modal Function //
  openCreateCategoryModal(): void {
    $('#addCategoryModal').modal('show');
    (<HTMLInputElement>document.getElementById('addCategoryFileId')).value = '';
    Object.keys(this.addCategoryForm.controls).forEach(key => {
      this.addCategoryForm.get(key).setValue('');
      this.addCategoryForm.get(key).markAsPristine();
      this.addCategoryForm.get(key).markAsUntouched();
      this.addCategoryForm.get(key).updateValueAndValidity();
    });
  }

  // Function to Handling the File Input On Select @Creation of Category //
  handleFileInput(files: FileList) {
    this.fileToUpload = null;
    this.fileToUpload = files.item(0);
  }

  // Function to Handling the File Input On Select @View/Update of Category //
  updateFileInput(files: FileList) {
    this.fileToUpdate = null;
    this.fileToUpdate = files.item(0);
  }

  // Add Category Function //
  addCategory(): void {
    $('#addCategoryModal').modal('hide');
    const formData = new FormData();
    formData.append('category_name', this.addCategoryForm.controls['category_name'].value);
    formData.append('status', this.addCategoryForm.controls['status'].value);
    if(this.fileToUpload == null) {
      formData.append('image', '');
    }
    else {
      formData.append('image', this.fileToUpload);
    }    
    this.categoryService.createCategory(formData).subscribe(data => {
      if (data.status == 'success' && data.status_code == 201) {
        this.successMessage = 'Category created successfully.';
        $('#successMessageModal').modal('show');
        // Calling All Categories Function //
        this.getAllCategories();
      }
      else {
        this.errorMessage = 'Error while creating category. Try Again.';
        $('#errorMessageModal').modal('show');
      }
    });
  }

  // View or Category Details Function //
  viewCategoryDetails(row: any): void {
    (<HTMLInputElement>document.getElementById('updateCategoryFileId')).value = '';
    this.updateCategoryForm.setValue({
      category_name: row.category_name,
      status: row.status
    });
    this.imagePath = row.image;
    this.categoryId = row.id;
    $('#viewCategoryModal').modal('show');
  }

  // Update Category Function //
  updateCategory(): void {
    $('#viewCategoryModal').modal('hide');
    const updateFormData = new FormData();
    updateFormData.append('category_name', this.updateCategoryForm.controls['category_name'].value);
    updateFormData.append('status', this.updateCategoryForm.controls['status'].value);
    updateFormData.append('id', this.categoryId);
    if(this.fileToUpdate == null) {
      updateFormData.append('image', '');
    }
    else {
      updateFormData.append('image', this.fileToUpdate);
    }
    this.categoryService.createCategory(updateFormData).subscribe(data => {
      if (data.status == 'success' && data.status_code == 200) {
        // Calling All Categories Function //
        this.getAllCategories();
        this.successMessage = 'Category updated successfully.';
        $('#successMessageModal').modal('show');
      }
      else {
        this.errorMessage = 'Error while updating category. Try Again.';
        $('#errorMessageModal').modal('show');
      }
    });
  }

  // Enable or Disable Comments Function //
  // Enable Or Disable Post Comments Function //
  enableOrDisableComments(id: any, status: string): void {
    status = status == 'false' ? 'true' : 'false';
    let formData = new FormData();
    formData.append('comment_status', status);
    formData.append('category_id', id);
    this.categoryService.enableOrDisableComments(formData).subscribe(resp => {
      if (resp.status == 'success' && resp.status_code == 200) {
        this.successMessage = resp.message;
        $('#successMessageModal').modal('show');
        this.getAllCategories();
      }
      else {
        this.errorMessage = resp.message;
        $('#errorMessageModal').modal('show');
      }
    });
  }

  // Prompt Delete Category Function //
  confirmDeleteCategory(row: any): void {
    this.categoryId = row.id;
    $('#confirmDeleteModal').modal('show');
  }

  // Delete Category Function //
  deleteCategory(): void {
    $('#confirmDeleteModal').modal('hide');
    let formData = new FormData();
    formData.append('category_id', this.categoryId);
    this.categoryService.deleteCategory(formData).subscribe(resp => {
      if (resp.status == 'success' && resp.status_code == 200) {
        this.successMessage = 'Category and related data deleted successfully..';
        $('#successMessageModal').modal('show');
        this.getAllCategories();
      }
      else {
        this.errorMessage = 'Error while deleting category. Try Again.';
        $('#errorMessageModal').modal('show');
      }
    });
  }

  ngOnInit() {
  }

}

export interface catagoryListResp {
  id: number;
  category_name: string;
  image: string;
  status: string;
  comments: string;
  subcategories: any[];
}
