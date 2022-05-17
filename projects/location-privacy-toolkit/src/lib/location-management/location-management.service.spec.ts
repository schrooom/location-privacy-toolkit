import { TestBed } from '@angular/core/testing'

import { LocationManagementService } from './location-management.service'

describe('LocationManagementService', () => {
  let service: LocationManagementService

  beforeEach(() => {
    TestBed.configureTestingModule({})
    service = TestBed.inject(LocationManagementService)
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })
})
