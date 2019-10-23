import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { CategoryService } from 'app/services/category.service';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
declare var $: any;

@Component({
  selector: 'app-trendingcategories',
  templateUrl: './trendingcategories.component.html',
  styleUrls: ['./trendingcategories.component.css']
})
export class TrendingcategoriesComponent implements OnInit {

  trendCategoryDetailsForm: FormGroup;
  trendCatId: string;
  successMessage: string;
  errorMessage: string;

  statusList = [
    { id: 1, name: 'Enable' },
    { id: 0, name: 'Disable' }
  ];

  // Displayd Column Name/Id's //
  displayedColumns = ['sno', 'category_name', 'image', 'cards_count', 'status', 'actions'];
  dataSource: MatTableDataSource<trendCategoryData>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  // Applying Filter for Employees Search //
  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  constructor(private formBuilder: FormBuilder, private categoryService: CategoryService) {

    // Trending Categories Form controls //
    this.trendCategoryDetailsForm = this.formBuilder.group({
      id: ['', Validators.required],
      category_name: [{ value: '', disabled: true }, Validators.required],
      status: ['', Validators.required],
      image: [''],
      cards_count: [{ value: '', disabled: true }],
      created_at: [{ value: '', disabled: true }],
      updated_at: [{ value: '', disabled: true }]
    })
    // Get All Trending Categories Function Invoking //
    this.getAllTrendingCategories();
  }

  // Get All Trending Categories Function //
  getAllTrendingCategories(): void {
    this.categoryService.getTrendingCategories().subscribe(resp => {
      if (resp.status == 'success' && resp.status_code == 200) {
        let filterArray = [];
        resp.trending_categories.forEach(function (item) {
          if (item.categories.length !== 0) {
            item.categories[0].cards_count = item.total;
            filterArray.push(item.categories[0]);
          }
        });
        this.dataSource = new MatTableDataSource(filterArray);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
      else {
        this.dataSource = new MatTableDataSource([]);
        this.errorMessage = 'Failed to list trending categories. Try again...!!!';
        $('#errorMessageModal').modal('show');
      }
    });
  }

  // View Trending Category Details Function //
  viewTrendCategoryDetails(row: any): void {
    this.trendCategoryDetailsForm.setValue({
      id: row.id,
      category_name: row.category_name,
      status: row.trending_category_status,
      cards_count: row.cards_count,
      image: row.image,
      created_at: row.created_at,
      updated_at: row.updated_at
    });
    $('#viewTrendCategoryModal').modal('show');
  }

  // Update Trending Category Function //
  updateTrendingCategory(): void {
    $('#viewTrendCategoryModal').modal('hide');
    let formData = new FormData();
    formData.append('category_id', this.trendCategoryDetailsForm.controls['id'].value);
    formData.append('trending_status', this.trendCategoryDetailsForm.controls['status'].value);
    this.categoryService.enableOrDisableTrendingCategory(formData).subscribe(resp => {
      if (resp.status == 'success' && resp.status_code == 200) {
        this.getAllTrendingCategories();
        this.successMessage = 'Trending category updated successfully.';
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

export interface trendCategoryData {
  id: string;
  category_name: string;
  cards_count: string;
  image: string;
  status: string;
  created_at: string;
  updated_at: string;
}
