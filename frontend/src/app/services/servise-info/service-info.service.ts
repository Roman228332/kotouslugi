// Файл не трогаем

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IActiveStep, IServiceForms, IStep } from '@models/step.model';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { IPreview } from '@models/common.model';
import { TForm } from '../../modules/add-cat/add-cat.component';
import { IService } from '@models/service.model';
import { UntypedFormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class ServiceInfoService {

  // хранение значения активного шага для использования из разных компонентов
  private activeStep$ = new BehaviorSubject<IActiveStep>(null);
  public activeStep = this.activeStep$.asObservable();

  // хранение формы для использования из разных компонентов
  public servicesForms$ = new BehaviorSubject<IServiceForms>(null);

  private serviceApi = '/api/service/';

  constructor(
    private http: HttpClient,
  ) { }

  /**
   * Возвращает список услуг
   */
  public getServices(): Observable<IService[]> {
    return this.http.get<IService[]>(`${this.serviceApi}list`);
  }

  /**
   * Возвращает список шагов для услуги
   * @param idService - мнемоника услуги
   */
  public getSteps(idService: string): Observable<IStep[]> {
    return this.http.get<IStep[]>(`/assets/jsons/services-orders/${idService}.json`);
  }

  /**
   * Устанавливает значение для активного шага
   * Нужно для обращения к параметру из разных компонентов
   * @param idService - мнемоника услуги
   * @param step - шаг
   */
  public setActiveStep(idService: string, step: number): void {
    this.activeStep$.next({
      [idService]: step
    });
  }

  /**
   * Возвращает json для отображения предпросмотра заполненной информации
   * @param rawValue - значение формы
   * @param steps - список шагов
   * @param FormMap - маппинг
   */
  public prepareDataForPreview(rawValue: any, steps: IStep[], FormMap: any): Array<IPreview[]> {
    const arr: Array<IPreview[]> = [];

    Object.keys(rawValue).forEach((step, index) => {
      // ИЗМЕНЕНИЕ ЗДЕСЬ: Проверяем, не является ли это последним шагом
      // (который предназначен только для проверки и не содержит полей для заполнения)
      if (rawValue[step] && index < steps.length - 1) { // <-- ДОБАВЛЕНО: && index < steps.length - 1
        const stepArr: any[] = [{title: steps[index].title}]; // Здесь теперь используется 'title' из food.json

        Object.keys(rawValue[step]).forEach((key) => {
          let value = rawValue[step][key];

          if (key === 'date' || key === 'deliveryDate') { // Добавляем 'deliveryDate' для форматирования даты
            value = new Date(rawValue[step][key]).toLocaleDateString('ru-RU', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
            });
          } else if (Array.isArray(value)) { // Обработка мультивыбора (продуктов)
            value = value.map(item => {
              try {
                return JSON.parse(item)?.text || item;
              } catch (error) {
                return item;
              }
            }).join(', '); // Объединяем выбранные элементы в строку
          }
          else {
            try {
              value = JSON.parse(value)?.text || value;
            } catch (error) {}
          }

          stepArr.push({
            name: FormMap[key],
            value: value || '-'
          });
        });

        arr.push(stepArr);
      }
    });

    return arr;
  }

}
