import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { CategoryService } from 'app/services/category.service';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
declare var $: any;

@Component({
  selector: 'app-subcategories',
  templateUrl: './subcategories.component.html',
  styleUrls: ['./subcategories.component.css']
})
export class SubcategoriesComponent implements OnInit {

  // Forms Reference //
  addSubCategoryForm: FormGroup;
  viewSubCategoryForm: FormGroup;

  // Files Info //
  fileToUpload: File = null;
  fileToUpdate: File = null;

  successMessage: string;
  errorMessage: string;
  categoryName: string;
  delCategoryId: string;
  delSubCategoryId: string;
  categoryData: any[];

  statusList = [
    { id: 1, name: 'Enable' },
    { id: 0, name: 'Disable' }
  ];

  // Displayd Column Name/Id's //
  displayedColumns = ['sno', 'main_category', 'category_name', 'image', 'status', 'actions'];
  dataSource: MatTableDataSource<subCatagoryListResp>;

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
    this.addSubCategoryForm = this.formBuilder.group({
      'category_id': ['', Validators.required],
      'category_name': ['', Validators.required],
      'status': ['', Validators.required]
    });

    // Create Category Form Controls //
    this.viewSubCategoryForm = this.formBuilder.group({
      'category_id': [{ value: null, disabled: true }, Validators.required],
      'main_category_name': [{ value: '', disabled: true }, Validators.required],
      'category_name': ['', Validators.required],
      'status': ['', Validators.required],
      'sub_category_id': ['', Validators.required],
      'image': ['', Validators.required]
    });

    // Get All Sub Categories Function Invoking //
    this.getAllSubCategories();
  }

  // Get All Sub Categories Function //
  getAllSubCategories(): void {
    this.categoryService.getAllSubCategories().subscribe(resp => {
      if (resp.status == 'success' && resp.status_code == 200) {
        this.dataSource = new MatTableDataSource(resp.data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
      else {
        this.errorMessage = 'Failed to list sub categories. Please reload...!!!';
        $('#errorMessageModal').modal('show');
      }
    });
  }

  // Function to Handling the File Input On Select @Creation of Sub Category //
  handleFileInput(files: FileList) {
    this.fileToUpload = null;
    this.fileToUpload = files.item(0);
  }

  // Open Create Sub Category Modal Function //
  openCreateSubCategoryModal(): void {
    this.categoryService.getAllCategories().subscribe(resp => {
      if (resp.status == 'success' && resp.status_code == 200) {
        this.categoryData = resp.data;
        (<HTMLInputElement>document.getElementById('addSubCategoryFileId')).value = '';
        $('#addSubCategoryModal').modal('show');
        this.addSubCategoryForm.reset();
      }
      else {
        this.errorMessage = 'Failed to list categories. Please reload...!!!';
        $('#errorMessageModal').modal('show');
      }
    });
  }

  // Add Subcategory Function //
  addSubCategory(): void {
    $('#addCategoryModal').modal('hide');
    const formData = new FormData();
    formData.append('category_name', this.addSubCategoryForm.controls['category_name'].value);
    formData.append('category_id', this.addSubCategoryForm.controls['category_id'].value);
    formData.append('status', this.addSubCategoryForm.controls['status'].value);
    if (this.fileToUpload == null) {
      formData.append('image', '');
    }
    else {
      formData.append('image', this.fileToUpload);
    }
    this.categoryService.createSubCategory(formData).subscribe(data => {
      if (data.status == 'success' && data.status_code == 201) {
        this.successMessage = 'Sub category created successfully.';
        $('#successMessageModal').modal('show');
        this.getAllSubCategories();
      }
      else {
        this.errorMessage = 'Error while creating sub category. Try Again.';
        $('#errorMessageModal').modal('show');
      }
    });
  }

  viewSubCategoryDetails(row: any) {
    this.fileToUpdate = null;
    (<HTMLInputElement>document.getElementById('updateSubCategoryFileId')).value = '';
    this.viewSubCategoryForm.setValue({
      main_category_name: row.categories.category_name,
      category_name: row.category_name,
      status: row.status,
      category_id: row.categories.id,
      sub_category_id: row.id,
      image: row.image
    });
    $('#viewSubCategoryModal').modal('show');
  }

  // Function to Handling the File Input On Select @Update of Sub Category //
  handleFileUpload(files: FileList): void {
    this.fileToUpdate = null;
    this.fileToUpdate = files.item(0);
  }

  updateSubCategory(): void {
    $('#viewSubCategoryModal').modal('hide');
    const updateFormData = new FormData();
    updateFormData.append('category_name', this.viewSubCategoryForm.controls['category_name'].value);
    updateFormData.append('category_id', this.viewSubCategoryForm.controls['category_id'].value);
    updateFormData.append('id', this.viewSubCategoryForm.controls['sub_category_id'].value);
    updateFormData.append('status', this.viewSubCategoryForm.controls['status'].value);
    if (this.fileToUpdate !== null) {
      updateFormData.append('image', this.fileToUpdate);
    }
    this.categoryService.createSubCategory(updateFormData).subscribe(data => {
      if (data.status == 'success' && data.status_code == 200) {
        // Calling All Sub Categories Function //
        this.getAllSubCategories();
        this.successMessage = 'Sub category updated successfully.';
        $('#successMessageModal').modal('show');
      }
      else {
        this.errorMessage = 'Error while updating sub category. Try Again.';
        $('#errorMessageModal').modal('show');
      }
    });
  }

  // Prompt Delete Category Function //
  confirmDeleteSubCategory(row: any): void {
    this.delSubCategoryId = row.id;
    this.delCategoryId = row.category_id;
    $('#confirmDeleteModal').modal('show');
  }

  // Delete Category Function //
  deleteSubCategory(): void {
    $('#confirmDeleteModal').modal('hide');
    let formData = new FormData();
    formData.append('category_id', this.delCategoryId);
    formData.append('subcategory_id', this.delSubCategoryId);

    this.categoryService.deleteSubCategory(formData).subscribe(resp => {
      if (resp.status == 'success' && resp.status_code == 200) {
        this.successMessage = 'Sub category and related data deleted successfully.';
        $('#successMessageModal').modal('show');
        this.getAllSubCategories();
      }
      else {
        this.errorMessage = 'Error while deleting sub category. Try Again.';
        $('#errorMessageModal').modal('show');
      }
    });
  }

  ngOnInit() {
  }

}

export interface subCatagoryListResp {
  id: string;
  category_name: string;
  image: string;
  category_id: string;
  status: string;
  categories: Object;
}