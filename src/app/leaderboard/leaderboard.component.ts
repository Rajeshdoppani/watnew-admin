import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ScratchcardService } from 'app/services/scratchcard.service';
declare var $: any;

@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.css']
})
export class LeaderboardComponent implements OnInit {

  errorMessage: string;
  successMessage: string;

  userDetailsForm: FormGroup;

  // Displayd Column Name/Id's //
  displayedColumns = ['sno', 'nick_name', 'mobile', 'amount', 'actions'];
  dataSource: MatTableDataSource<leaderBoardListResp>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  // Applying Filter for Employees Search //
  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  constructor(private scratchService: ScratchcardService, private formBuilder: FormBuilder) {
    // User Details Form Controls //
    this.userDetailsForm = this.formBuilder.group({
      id: [{ value: '', disabled: true }, Validators.required],
      nick_name: [{ value: '', disabled: true }, Validators.required],
      amount: [{ value: '', disabled: true }, Validators.required],
      mobile: [{ value: '', disabled: true }, Validators.required]
    });

    // Get Leaderboard Of Users Function Invoking //
    this.getLeaderBoardOfUsers();
  }

  // Get Leaderboard Of Users Function //
  getLeaderBoardOfUsers() {
    this.scratchService.getLeaderBoardOfUsers().subscribe(resp => {
      if (resp.status == 'success' && resp.status_code == 200) {
        this.dataSource = new MatTableDataSource(resp.data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
      else {
        this.dataSource = new MatTableDataSource([]);
        this.errorMessage = resp.message;
        $('#errorMessageModal').modal('show');
      }
    });
  }

  // View User Details Of Leaderboard Function //
  viewUserDetails(row: any) {
    this.userDetailsForm.setValue({
      id: row.id,
      nick_name: row.nick_name,
      amount: row.amount,
      mobile: row.mobile
    });
    $('#userDetailsModal').modal('show');
  }

  ngOnInit() {
  }

}
declare interface leaderBoardListResp {

}
