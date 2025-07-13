import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, UntypedFormGroup, Validators } from '@angular/forms';
import { IValueCat } from '@models/cat.model';
import { Subscription, take } from 'rxjs';
import { ServiceInfoService } from '@services/servise-info/service-info.service';
import { ActivatedRoute } from '@angular/router';
import { CatService } from '@services/cat/cat.service';
import { CheckInfoComponent } from '@components/check-info/check-info.component';
import { ConstantsService } from '@services/constants/constants.service';
import { IStep } from '@models/step.model';
import { JsonPipe } from '@angular/common';
import { ThrobberComponent } from '@components/throbber/throbber.component';
import { IValue } from '@models/common.model'; // Добавляем импорт для IValue

// Новая enum для отображения названий полей в CheckInfoComponent
export enum FormMap {
  cat = 'Кличка кота',
  orderName = 'Имя для заказа', // Новое поле
  telephone = 'Телефон для связи',
  email = 'Email для связи',

  city = 'Город', // Новое поле
  street = 'Улица', // Новое поле
  floor = 'Этаж', // Новое поле
  entrance = 'Подъезд', // Новое поле

  shop = 'Магазин',
  deliveryType = 'Тип доставки', // Новое поле
  deliveryDate = 'Дата доставки', // Новое поле
  deliveryTime = 'Время доставки',
  products = 'Продукты', // Теперь это мультиселект

  comment = 'Комментарий к заказу'
}

@Component({
  selector: 'app-food',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CheckInfoComponent,
    JsonPipe,
    ThrobberComponent,
  ],
  templateUrl: './food.component.html',
  styleUrl: './food.component.scss'
})
export class FoodComponent implements OnInit, OnDestroy {

  public loading = true;
  public form: UntypedFormGroup;
  public active: number;
  public optionsCat: IValueCat[];
  public shopOptions = this.constantService.shopOptions; // Список магазинов
  public deliveryTypeOptions = this.constantService.deliveryTypeOptions; // Добавляем опции типа доставки
  public productOptions = this.constantService.productOptions; // Добавляем опции продуктов
  public cityOptions = this.constantService.cityOptions; // Добавляем опции городов
  public streetOptions = this.constantService.streetOptions; // Добавляем опции улиц (возможно, будет зависеть от города)


  private idService: string;
  private steps: IStep[];
  private subscriptions: Subscription[] = [];

  public get getResult() {
    return this.serviceInfo.prepareDataForPreview(this.form.getRawValue(), this.steps, FormMap);
  }

  constructor(
    private fb: FormBuilder,
    private serviceInfo: ServiceInfoService,
    private route: ActivatedRoute,
    private catService: CatService,
    private constantService: ConstantsService,
  ) {
  }

  public ngOnInit(): void {
    this.getCatOption();
  }

  public ngOnDestroy() {
    this.subscriptions.forEach(item => {
      item.unsubscribe();
    })
  }

  private getCatOption(): void {
    this.constantService.getCatOptionsAll().pipe(
      take(1)
    ).subscribe((res: IValueCat[]) => {
      this.optionsCat = res;
      this.prepareService();
    });
  }

  private prepareService(): void {
    this.route.data.pipe(
      take(1)
    ).subscribe(res => {
      this.idService = res['idService'];

      this.serviceInfo.getSteps(this.idService).pipe(
        take(1)
      ).subscribe(res => {
        this.steps = res;
      });

      this.subscriptions.push(
        this.serviceInfo.activeStep.subscribe(res => {
          this.active = res?.[this.idService] || 0;
        })
      );

      this.initForm();
    });
  }

  private initForm(): void {
    this.form = this.fb.group({
      // Этап 1: Информация о коте и контактные данные
      0: this.fb.group({
        cat: [JSON.stringify(this.optionsCat[0]), [Validators.required]],
        orderName: ['', [Validators.required, Validators.maxLength(100)]], // Имя на которое будет заказ
        telephone: ['', [Validators.required, Validators.pattern(/^[\d]{11}$/)]],
        email: ['', [Validators.email]]
      }),
      // Этап 2: Адрес
      1: this.fb.group({
        city: [JSON.stringify(this.cityOptions[0]), [Validators.required]],
        street: [JSON.stringify(this.streetOptions[0]), [Validators.required]],
        floor: [''], // Необязательно
        entrance: [''] // Необязательно
      }),
      // Этап 3: Детали заказа
      2: this.fb.group({
        shop: [JSON.stringify(this.shopOptions[0]), [Validators.required]],
        deliveryType: [JSON.stringify(this.deliveryTypeOptions[0]), [Validators.required]],
        deliveryDate: ['', [Validators.required, this.dateValidator]], // Дата к которой привезти
        deliveryTime: ['', [Validators.required]],
        products: [[JSON.stringify(this.productOptions[0])], [Validators.required]], // Мультиселект, поэтому массив
      }),
      // Этап 4: Комментарий к заказу (необязательный)
      3: this.fb.group({
        comment: ['']
      }),
      // Этап 5: Проверка информации (пустая группа для CheckInfoComponent)
      4: this.fb.group({})
    });

    this.serviceInfo.servicesForms$.next({
      [this.idService]: this.form
    });

    this.loading = false;
  }

  /**
   * Кастомная валидация для даты (может быть общая для всех дат)
   * @param control
   * @private
   */
  private dateValidator(control: FormControl) {
    if (new Date(control.value) < new Date()) {
      return {minDate: true};
    }
    return null; // Возвращаем null, если валидация успешна, а не false
  }

  /**
   * Возвращает json в виде строки для селектов
   * @param type
   * @param index
   */
  public getItem(type: 'cat' | 'shop' | 'deliveryType' | 'product' | 'city' | 'street', index: number): string {
    if (type === 'cat') {
      return JSON.stringify(this.optionsCat[index]);
    }
    if (type === 'shop') {
      return JSON.stringify(this.shopOptions[index]);
    }
    if (type === 'deliveryType') {
      return JSON.stringify(this.deliveryTypeOptions[index]);
    }
    if (type === 'product') {
      return JSON.stringify(this.productOptions[index]);
    }
    if (type === 'city') {
      return JSON.stringify(this.cityOptions[index]);
    }
    if (type === 'street') {
      return JSON.stringify(this.streetOptions[index]);
    }
    return ''; // Дефолтное значение
  }

  /**
   * Возвращает контрол формы
   * @param step
   * @param id
   */
  public getControl(step: number, id: string): FormControl {
    return this.form.get(`${step}.${id}`) as FormControl;
  }

}
