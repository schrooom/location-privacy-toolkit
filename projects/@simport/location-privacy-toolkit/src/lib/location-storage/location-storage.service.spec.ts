import { TestBed } from '@angular/core/testing'

import { LocationStorageService } from './location-storage.service'

describe('LocationStorageService', () => {
  let service: LocationStorageService

  beforeEach(() => {
    TestBed.configureTestingModule({})
    service = TestBed.inject(LocationStorageService)
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })
})
