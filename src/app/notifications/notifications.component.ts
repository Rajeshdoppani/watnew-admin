import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UsersService } from 'app/services/users.service';
import { NotificationsService } from 'app/services/notifications.service';
import { MatOption, MatAutocomplete } from '@angular/material';
declare var $: any;
@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {

  addNotificationsForm: FormGroup;
  addpostNotificationsForm: FormGroup;
  addpageNotificationsForm: FormGroup;
  successMessage: string;
  errorMessage: string;
  usersList: any[];
  notificationImage: File = null;
  postList: any;
  pagelist: any;
  search_result: any;
  request: any;
  sectionVisible: any;
  titleName: any;
  @ViewChild('allSelected') private allSelected: MatOption;
  @ViewChild('allpageSelected') private allpageSelected: MatOption;
  @ViewChild('allpostSelected') private allpostSelected: MatOption;

  applyFilter(filterValue) { }

  constructor(private formBuilder: FormBuilder, private usersService: UsersService, private notificationsService: NotificationsService) {
    // Add Notifications Form Controls //
    this.addNotificationsForm = this.formBuilder.group({
      message: [null, Validators.required],
      users_id: [[], Validators.required],
      video_url: null,
      file: null
    });

    // Add Notifications Form Controls //
    this.addpostNotificationsForm = this.formBuilder.group({
      post_id: null,
      post_title: [null, Validators.required],
      postusers_id: [[], Validators.required]
    });

    // Add Notifications Form Controls //
    this.addpageNotificationsForm = this.formBuilder.group({
      page_id: [null, Validators.required],
      pageusers_id: [[], Validators.required]
    });
    this.loadPages();
  }


  loaduser() {
    this.usersService.getAllUsers().subscribe(resp => {
      if (resp.status == 'success' && resp.status_code == 200) {
        this.usersList = resp.data;
      } else {
        this.errorMessage = resp.message;
        $('#errorMessageModal').modal('show');
      }
    });
  }

  loadPages() {
    this.notificationsService.getPages().subscribe(resp => {
      if (resp.status == 'success' && resp.status_code == 200) {
        this.pagelist = resp.data;
      } else {
        this.errorMessage = resp.message;
        $('#errorMessageModal').modal('show');
      }
    });
  }

  // Option to select //
  openAddNotifyModal() {
    $('#promptTypeOfAddModal').modal('show');
  }

  // Open Add Notifications Modal Function //
  opengeneralModal(): void {
    $('#promptTypeOfAddModal').modal('hide');
    this.loaduser();
    this.addNotificationsForm.reset();
    $('#addNotificationsModal').modal('show');
  }

  // Open post modal //
  openpostModal() {
    $('#promptTypeOfAddModal').modal('hide');
    this.addpostNotificationsForm.reset();
    this.postList = [];
    this.loaduser();
    $('#addpostNotificationsModal').modal('show');
  }

  // Open page model //
  openpageModal() {
    $('#promptTypeOfAddModal').modal('hide');
    this.loaduser();
    this.addpageNotificationsForm.reset();
    $('#addpageNotificationsModal').modal('show');
  }

  // general notification //
  tosslePerOne(all) {
    if (this.allSelected.selected) {
      this.allSelected.deselect();
      return false;
    }
    if (this.addNotificationsForm.controls.users_id.value.length == this.usersList.length)
      this.allSelected.select();
  }

  toggleAllSelection() {
    if (this.allSelected.selected) {
      this.addNotificationsForm.controls.users_id
        .patchValue([...this.usersList.map(item => item.id), 0]);
    } else {
      this.addNotificationsForm.controls.users_id.patchValue([]);
    }
  }

  // page notification //
  tosslepage(all) {
    if (this.allpageSelected.selected) {
      this.allpageSelected.deselect();
      return false;
    }
    if (this.addpageNotificationsForm.controls.pageusers_id.value.length == this.usersList.length)
      this.allpageSelected.select();
  }

  togglepageAllSelection() {
    if (this.allpageSelected.selected) {
      this.addpageNotificationsForm.controls.pageusers_id
        .patchValue([...this.usersList.map(item => item.id), 0]);
    } else {
      this.addpageNotificationsForm.controls.pageusers_id.patchValue([]);
    }
  }

  // Post notification //
  tosslepost(all) {
    if (this.allpostSelected.selected) {
      this.allpostSelected.deselect();
      return false;
    }
    if (this.addpostNotificationsForm.controls.postusers_id.value.length == this.usersList.length)
      this.allpostSelected.select();
  }

  togglepostAllSelection() {
    if (this.allpostSelected.selected) {
      this.addpostNotificationsForm.controls.postusers_id
        .patchValue([...this.usersList.map(item => item.id), 0]);
    } else {
      this.addpostNotificationsForm.controls.postusers_id.patchValue([]);
    }
  }

  // Notification Image File Input Function //
  imageInputFile(files: FileList): void {
    this.notificationImage = null;
    this.notificationImage = files.item(0);
  }

  onChange(res) {
    if (res.length >= 3) {
      $('mat-form-field.postTitle').css({ "height": "257px", "overflow-y": "scroll" });
      this.sectionVisible = 'false';
      let searchtext = res;
      this.search_result = searchtext.match(/#(\w+)/g);
      if (this.search_result) {
        this.request = {
          tag: res
        }
      } else {
        this.request = {
          key_word: res
        }
      }
      this.notificationsService.getPosts(this.request).subscribe(resp => {
        if (resp.status_code == 200) {
          this.postList = resp.data.data;
        }
      });
    }
  }

  seletedPost(resp) {
    this.titleName = resp.title;
    this.addpostNotificationsForm.controls['post_id'].setValue(resp.id);
    this.addpostNotificationsForm.controls['post_title'].setValue(resp.title);
    this.sectionVisible = 'true';
    $('mat-form-field.postTitle').removeAttr("style");
  }

  // Add Notifications Function //
  sendNotification(): void {
    $('#addNotificationsModal').modal('hide');
    let formData = new FormData();
    formData.append('message', this.addNotificationsForm.controls['message'].value);
    formData.append('type', '1');
    if (this.addNotificationsForm.controls['video_url'].value !== null && this.addNotificationsForm.controls['video_url'].value !== '') {
      formData.append('video_url', this.addNotificationsForm.controls['video_url'].value);
    }
    if (this.addNotificationsForm.controls['file'].value !== null && this.addNotificationsForm.controls['file'].value !== '') {
      formData.append('file', this.notificationImage);
    }
    for (let i = 0; i < this.addNotificationsForm.controls['users_id'].value.length; i++) {
      if (this.addNotificationsForm.controls['users_id'].value[i] != '0') {
        //        console.log(this.addNotificationsForm.controls['users_id'].value.length);
        // console.log(this.addNotificationsForm.controls['users_id'].value[i]);
        formData.append('users[' + i + '][id]', this.addNotificationsForm.controls['users_id'].value[i]);
      }
    }
    this.notificationsService.addNotifications(formData).subscribe(resp => {
      if (resp.status == 'success' && resp.status_code == 200) {
        this.successMessage = resp.message;
        $('#successMessageModal').modal('show');
      }
      else {
        this.errorMessage = resp.message;
        $('#errorMessageModal').modal('show');
      }
    });
  }


  // Page Notification //
  sendPageNotification() {
    $('#addpageNotificationsModal').modal('hide');
    let formData = new FormData();
    formData.append('page_id', this.addpageNotificationsForm.controls['page_id'].value);
    formData.append('type', '2');
    for (let i = 0; i < this.addpageNotificationsForm.controls['pageusers_id'].value.length; i++) {
      if (this.addpageNotificationsForm.controls['pageusers_id'].value[i] != '0') {
        //        console.log(this.addNotificationsForm.controls['users_id'].value.length);
        // console.log(this.addNotificationsForm.controls['users_id'].value[i]);
        formData.append('users[' + i + '][id]', this.addpageNotificationsForm.controls['pageusers_id'].value[i]);
      }
    }
    this.notificationsService.addNotifications(formData).subscribe(resp => {
      if (resp.status == 'success' && resp.status_code == 200) {
        this.successMessage = resp.message;
        $('#successMessageModal').modal('show');
      }
      else {
        this.errorMessage = resp.message;
        $('#errorMessageModal').modal('show');
      }
    });
  }

  // Post Notification //
  sendPostNotification() {
    $('#addpostNotificationsModal').modal('hide');
    let formData = new FormData();
    formData.append('post_id', this.addpostNotificationsForm.controls['post_id'].value);
    formData.append('type', '3');
    for (let i = 0; i < this.addpostNotificationsForm.controls['postusers_id'].value.length; i++) {
      if (this.addpostNotificationsForm.controls['postusers_id'].value[i] != '0') {
        //        console.log(this.addNotificationsForm.controls['users_id'].value.length);
        // console.log(this.addNotificationsForm.controls['users_id'].value[i]);
        formData.append('users[' + i + '][id]', this.addpostNotificationsForm.controls['postusers_id'].value[i]);
      }
    }
    this.notificationsService.addNotifications(formData).subscribe(resp => {
      if (resp.status == 'success' && resp.status_code == 200) {
        this.successMessage = resp.message;
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
