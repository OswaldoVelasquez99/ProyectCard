import { Component, OnInit } from "@angular/core";
import { MenuController, NavController, ToastController } from "@ionic/angular";
import { AuthService } from "../service/auth/auth.service";
import firebase from "firebase";
import { User } from "../interfaces/User";
import { Validators, FormGroup, FormBuilder } from "@angular/forms";
import { CustomValidators } from "src/utils/CustomValidators";
//Native apis
import { Camera } from '@ionic-native/camera/ngx';
import { StorageService } from "../service/storage/storage.service"
import { CameraService } from "../service/camera/camera.service"
@Component({
  selector: "app-login",
  templateUrl: "./login.page.html",
  styleUrls: ["./login.page.scss"],
})
export class LoginPage implements OnInit {
  loginFlag: boolean = true;
  user = {} as User;
  //CameraOptions : any
  //source: any
  loginForm: FormGroup;
  registerForm: FormGroup;

  constructor(
    private menu: MenuController,
    private auth: AuthService,
    public toast: ToastController,
    private router: NavController,
    private formBuilder: FormBuilder,
    private storageService: StorageService,
    private cameraService: CameraService
  ) {
    this.buildForm();
  }

  ngOnInit() {
    this.menu.enable(false);
    firebase.auth().onAuthStateChanged((user) => {
      if (user) this.router.navigateRoot(['home'])
    });
  }

  private buildForm() {
    this.loginForm = this.formBuilder.group({
      email: [
        "",
        [Validators.required, Validators.email, Validators.minLength(4)],
      ],
      password: ["", [Validators.required]],
    });
    this.registerForm = this.formBuilder.group(
      {
        nickname: ["", [Validators.required, Validators.maxLength(15)]],
        email: ["", [Validators.required, Validators.email]],
        password: ["", [Validators.required, Validators.minLength(6)]],
        confirmPassword: ["", [Validators.required]],
      },
      {
        validators: [CustomValidators.confirmPassword],
      }
    );
  }
  async checkin() {
    if (this.registerForm.valid) {
      try {
        this.user.email = this.email.value;
        this.user.nickname = this.nickname.value;
        this.user.password = this.password.value;
        let user = await this.auth.checkin(this.user);
        this.presentToast(
          `Usuario ${user.nickname} registrado exitosamente`,
          2000,
          false
        );
        this.loginFlag = true;
      } catch (error) {
        this.presentToast(error.message, 2000, true);
        console.error(error);
      }
    }
  }

  async login() {
    try {
      this.user.email = this.email.value;
      this.user.password = this.password.value;
      let user: firebase.User = await this.auth.login(
        this.user.email,
        this.user.password,
      );
      this.presentToast(`Ingreso de ${user.email} exitoso`, 3000, false);
      setTimeout(() => {
        this.router.navigateRoot(["home"]);
      }, 3000);
    } catch (error) {
      this.presentToast(error.message, 3000, true);
      console.error(error);
    }
  }

  async getPicture(source: string) {
    let base64Image = await this.cameraService.getPicture(source);
    console.log("BASE64:: ", base64Image);
    let result = await this.storageService.saveUserImage(
      this.user,
      base64Image
    );
    console.log("Result: ", result)
  }

  // getter
  get email() {
    if (this.loginFlag) return this.loginForm.get("email");
    else return this.registerForm.get("email");
  }
  get password() {
    if (this.loginFlag) return this.loginForm.get("password");
    else return this.registerForm.get("password");
  }
  get nickname() {
    return this.registerForm.get("nickname");
  }
  get confirmPassword() {
    return this.registerForm.get("confirmPassword");
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
