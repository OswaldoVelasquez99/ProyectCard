import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NavController, ToastController } from "@ionic/angular";
import firebase from "firebase";
import { User } from "../interfaces/User";
import { UsersService } from "../service/users/users.service";

@Component({
  selector: "app-profile",
  templateUrl: "./profile.page.html",
  styleUrls: ["./profile.page.scss"],
})
export class ProfilePage implements OnInit {
  user = {} as User;
  form: FormGroup;

  constructor(
    private userService: UsersService,
    public toast: ToastController,
    private formBuilder: FormBuilder,
    private router: NavController
  ) {
    this.form = this.formBuilder.group({
      nickname: ["", [Validators.required, Validators.maxLength(15)]],
    });
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.user.uid = user.uid;
        this.userService.getUser(user.uid).on("value", (snapshot) => {
          let data = snapshot.val();
          this.nickname.setValue(data.nickname);
        });
      } else this.router.navigateRoot(["login"]);
    });
  }

  ngOnInit() {}

  updateUser() {
    this.userService.updateUser(this.user.uid, {
      nickname: this.nickname.value,
    });
    this.presentToast(
      `Usuario ${this.nickname.value} actualizado exitosamente`,
      2000,
      false
    );
  }

  get nickname() {
    return this.form.get("nickname");
  }
  // utils
  async presentToast(message: string, time: number, error: boolean) {
    const toast = await this.toast.create({
      message: message,
      duration: time,
      color: !error ? "success" : "warning",
    });
    toast.present();
  }
}
