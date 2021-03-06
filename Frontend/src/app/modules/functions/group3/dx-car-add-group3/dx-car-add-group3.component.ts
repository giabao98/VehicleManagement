import { Component, OnInit, Injector } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { NgForm } from '@angular/forms';
import { Group3DeXuatServiceProxy, Group3BangGiaServiceProxy, Group3DeXuatDto, Group3BangGiaDto } from '@shared/service-proxies/service-proxies';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-dx-car-add-group3',
  templateUrl: './dx-car-add-group3.component.html',
  styleUrls: ['./dx-car-add-group3.component.css', '../../style.less']
})
export class DxCarAddGroup3Component extends AppComponentBase implements OnInit {
  carName: string;
  manufacturer: string;
  color: string;
  manuYear: number;
  amount: number;
  saler: any = [];
  price: any = [];
  recommendPrices = [{ price: null, saler: null }, { price: null, saler: null }, { price: null, saler: null }];

  reason: string;
  purpose: string;

  group3DeXuatAddInput: Group3DeXuatDto = new Group3DeXuatDto();
  group3BangGiaAddInput: Group3BangGiaDto = new Group3BangGiaDto();
  submitted = false;

  constructor(injector: Injector, private group3DeXuatService: Group3DeXuatServiceProxy, private group3BangGiaService: Group3BangGiaServiceProxy) {
    super(injector);
  }

  setValue() {
    this.group3DeXuatAddInput.deXuat_TenXe = this.carName;
    this.group3DeXuatAddInput.deXuat_Mau = this.color;
    this.group3DeXuatAddInput.deXuat_SoLuong = this.amount;
    this.group3DeXuatAddInput.deXuat_LyDo = this.reason;
    this.group3DeXuatAddInput.deXuat_MucDich = this.purpose;
    this.group3DeXuatAddInput.deXuat_SoLuong = this.amount;

    this.group3BangGiaAddInput.chuThau = [];
    this.group3BangGiaAddInput.gia = [];
    for (let index = 0; index < this.recommendPrices.length; index++) {
      this.saler.push(this.recommendPrices[index].saler);
      this.price.push(this.recommendPrices[index].price);
    }
    this.group3BangGiaAddInput.soLuong = this.recommendPrices.length;
  }

  checkInputValue(): boolean {
    if (this.carName == null || this.carName == '') {
      this.notify.error(this.l("Vui l??ng nh???p t??n xe", "ERROR", environment.opt));
      return false;
    }
    if (this.manufacturer == null || this.manufacturer == '' || !!this.manufacturer.match(/a-zA-Z0-9/i)) {
      this.notify.error(this.l("Vui l??ng nh???p h??ng xe", "ERROR", environment.opt));
      return false;
    }
    if (this.color == null || this.color == '') {
      this.notify.error(this.l("Vui l??ng nh???p m??u xe", "ERROR", environment.opt));
      return false;
    }
    if (this.reason == null || this.reason == '') {
      this.notify.error(this.l("Vui l??ng nh???p l?? do", "ERROR", environment.opt));
      return false;
    }
    if (this.purpose == null || this.purpose == '') {
      this.notify.error(this.l("Vui l??ng nh???p m???c ????ch", "ERROR", environment.opt));
      return false;
    }
    if (this.amount == null  || this.amount < 1) {
      this.notify.error(this.l("Vui l??ng nh???p s??? l?????ng ph?? h???p (> 1)", "ERROR", environment.opt));
      return false;
    }
    if (this.manuYear == null || this.manuYear <= 1886 || this.manuYear > new Date().getFullYear()) {
      this.notify.error(this.l(`Vui l??ng nh???p n??m ph?? h???p (1886 < n??m < ${new Date().getFullYear()})`, "ERROR", environment.opt));
      return false;
    }
    if (this.saler.includes(null)) {
      this.notify.error(this.l("Vui l??ng nh???p ch??? th???u ph?? h???p", "ERROR", environment.opt));
      return false;
    } else {
      this.group3BangGiaAddInput.chuThau = this.saler;
    }
    if (this.price.includes(null)) {
      this.notify.error(this.l("Vui l??ng nh???p b???ng gi?? ph?? h???p", "ERROR", environment.opt));
      return false;
    } else {
      this.group3BangGiaAddInput.gia = this.price;
    }
    return true;
  }

  onSubmit(f: NgForm) {
    this.setValue();

    if (this.checkInputValue() == false) return;

    this.group3DeXuatService.deXuat_Group3Insert(this.group3DeXuatAddInput).subscribe((response) => {
      if (response["Result"] == "1") {
        this.notify.error(this.l("Th??m ????? xu???t xe th???t b???i", "ERROR", environment.opt));
        this.cancel();
        window.location.reload();
      } else {
        this.notify.info(this.l("Th??m ????? xu???t xe th??nh c??ng"));
      }
      this.group3BangGiaService.bangGia_Group3Insert(this.group3BangGiaAddInput).subscribe((response) => {
        if (response["Result"] == "1") {
          this.notify.error(this.l("Th??m b???ng gi?? th???t b???i", "ERROR", environment.opt));
          this.cancel();
          window.location.reload();
        } else {
          this.notify.info(this.l("Th??m b???ng gi?? th??nh c??ng"));
        }
      });
    });
  }                 

  addPriceItem() {
    this.recommendPrices.push({ price: null, saler: null });
    console.log(this.recommendPrices);
  }

  cancel() {
    this.carName = null;
    this.color = null;
    this.amount = null;
    this.reason = null;
    this.purpose = null;
    this.amount = null;
    this.saler = [];
    this.price = [];
  }

  ngOnInit() {
    this.amount = 1;
  }

}
