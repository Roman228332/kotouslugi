// C:\Users\Admin1\Downloads\kotuslugi\kotouslugi-2025-summer-team-cheremsha\frontend\src\app\modules\service\components\vet\constants.service.ts

import { Injectable } from '@angular/core';
import { EBreedMap, ESexMap, IValueBreed, IValueSex, IValueCat, ICatGroupedBySex } from '@models/cat.model';
import { mergeMap, Observable, of, take } from 'rxjs';
import { CatService } from '@services/cat/cat.service';
import { IValue } from '@models/common.model'; // Твой интерфейс IValue

@Injectable({
  providedIn: 'root'
})
export class ConstantsService {

  // варианты пола
  public sexOptions: IValueSex[] = [
    {
      id: 'male', // У этого свой тип IValueSex, где id может быть строкой. Это нормально.
      text: ESexMap.male
    },
    {
      id: 'female',
      text: ESexMap.female
    }
  ];

  // варианты пород
  public breedOptions: IValueBreed[] = [
    {
      id: 'siamese', // У этого свой тип IValueBreed, где id может быть строкой. Это нормально.
      text: EBreedMap.siamese
    },
    {
      id: 'british_shorthair',
      text: EBreedMap.british_shorthair
    },
    {
      id: 'maine_coon',
      text: EBreedMap.maine_coon
    },
    {
      id: 'persian',
      text: EBreedMap.persian
    },
    {
      id: 'sphinx',
      text: EBreedMap.sphinx
    },
    {
      id: 'scottish_fold',
      text: EBreedMap.scottish_fold
    },
    {
      id: 'russian_blue',
      text: EBreedMap.russian_blue
    },
    {
      id: 'munchkin',
      text: EBreedMap.munchkin
    }
  ];

  // варианты специалистов (используют IValue, id: number)
  public doctorOptions: IValue[] = [
    {
      id: 0,
      text: 'Терапевт'
    },
    {
      id: 1,
      text: 'Ортопед'
    },
    {
      id: 2,
      text: 'Офтальмолог'
    },
    {
      id: 3,
      text: 'Хирург'
    },
    {
      id: 4,
      text: 'Дерматолог'
    }
  ];

  // Варианты магазинов для заказа еды (используют IValue, id: number)
  public shopOptions: IValue[] = [
    {
      id: 0,
      text: 'Зоомагазин "КотБатон"'
    },
    {
      id: 1,
      text: 'Супермаркет "Пушистик"'
    },
    {
      id: 2,
      text: 'Интернет-магазин "МурМурФуд"'
    },
    {
      id: 3,
      text: 'Местный ларек у Мурки'
    }
  ];

  // Варианты типов доставки (используют IValue, id: number)
  public deliveryTypeOptions: IValue[] = [
    { id: 0, text: 'Доставка' },
    { id: 1, text: 'Самовывоз' }
  ];

  // Варианты продуктов (для мультивыбора) (используют IValue, id: number)
  public productOptions: IValue[] = [
    { id: 0, text: 'Сухой корм для взрослых' },
    { id: 1, text: 'Влажный корм для котят' },
    { id: 2, text: 'Лакомства для зубов' },
    { id: 3, text: 'Кошачья мята (спрей)' },
    { id: 4, text: 'Наполнитель комкующийся' },
    { id: 5, text: 'Игрушка-лазер' }
  ];

  // Варианты городов (используют IValue, id: number)
  public cityOptions: IValue[] = [
    { id: 0, text: 'Ереван' },
    { id: 1, text: 'Гюмри' },
    { id: 2, text: 'Ванадзор' }
  ];

  // Варианты улиц (используют IValue, id: number)
  public streetOptions: IValue[] = [
    { id: 0, text: 'Туманяна' },
    { id: 1, text: 'Маштоца' },
    { id: 2, text: 'Сарьяна' },
    { id: 3, text: 'Кохбаци' }
  ];

  constructor(
    private catService: CatService,
  ) { }

  /**
   * Возвращает список котов сгруппированных по полу, преобразовывая ответ для использования в dropdown
   */
  public getCatOptionsBySex(): Observable<ICatGroupedBySex> {
    return this.catService.getCatList().pipe(
      take(1)
    ).pipe(
      mergeMap((res) => {
        const male: IValueCat[] = [];
        const female: IValueCat[] = [];
        res.forEach(item => {
          if (item.sex === 'male') {
            male.push({id: item.id, text: item.name});
          } else {
            female.push({id: item.id, text: item.name});
          }
        });
        return of({
          male,
          female
        });
      })
    );
  }

  /**
   * Возвращает список котов, преобразовывая ответ для использования в dropdown
   */
  public getCatOptionsAll():  Observable<IValueCat[]> {
    return this.catService.getCatList().pipe(
      take(1)
    ).pipe(
      mergeMap((res) => {
        return of(res.map((item) => {
          return {
            id: item.id,
            text: item.name
          }
        }));
      })
    )
  }
}
