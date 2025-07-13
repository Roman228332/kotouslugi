// C:\Users\Admin1\Downloads\kotuslugi\kotouslugi-2025-summer-team-cheremsha\frontend\src\app\modules\service\components\vet\constants.service.ts

import { Injectable } from '@angular/core';
import { EBreedMap, ESexMap, IValueBreed, IValueSex, IValueCat, ICatGroupedBySex } from '@models/cat.model';
import { mergeMap, Observable, of, take } from 'rxjs';
import { CatService } from '@services/cat/cat.service';
import { IValue } from '@models/common.model';

@Injectable({
  providedIn: 'root'
})
export class ConstantsService {

  // варианты пола
  public sexOptions: IValueSex[] = [
    {
      id: 'male',
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
      id: 'siamese',
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

  // варианты специалистов
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

  // 👇 Добавляем варианты магазинов для заказа еды
  public shopOptions: IValue[] = [
    {
      id: 0, // Или используй строковые ID, если так удобнее для бэкенда (например, 'pet_store_1')
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
