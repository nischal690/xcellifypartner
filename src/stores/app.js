import { makeAutoObservable } from "mobx";
import { AuthStatuses, ProfileStatuses } from "../utils/constants";

import apiRequest from "../utils/apiRequest";

//import { getLocalStorageItem, setLocalStorageItem } from '@/utils/storage';
class AppStore {
  authStatus = AuthStatuses.UNAUTHENTICATED;
  profileStatus = ProfileStatuses.UNVERIFIED;
  partnerInfo = {};
  products = [];
  loading = false;
  error = null;
  searchValue = '';

  constructor() {
    makeAutoObservable(this);
  }

  get getPartnerInfo() {
    return this.partnerInfo;
  }

  updatePartnerInfo = (partnerInfo) => {
    this.partnerInfo = partnerInfo;
  };
  setSearchValue = (searchValue) => {
    this.searchValue = searchValue;
  };
  addProducts = (productsDetails) => {
    this.products = productsDetails;
  };

  setAppProperty = (property, value) => {
    this[property] = value;
  };

  getApiBaseUrl(category) {
    if (typeof category !== 'string') {
      console.error('Invalid category passed to getApiBaseUrl:', category);
      throw new Error(`Unknown category: ${JSON.stringify(category)}`);
    }

    switch (category) {
      case 'Study overseas':
      case 'Study India':
        return 'mic-study';
      case 'Tutoring':
      case 'Career counselling':
      case 'Summer courses':
        return 'mic-counselling';
      case 'Study Finance':
      case 'Loans and scholarships':
        return 'mic-finance';
      case 'Events':
      case 'Competitions':
        return 'mic-events';
      default:
        console.error('Category not matched:', category);
        throw new Error(`Unknown category: ${category}`);
    }
  }

  async submitProducts(category, formData) {
    console.log('Category passed to submitProducts:', category);

    const baseUrl = this.getApiBaseUrl(category);
    const url = `${baseUrl}/create`;

    this.setAppProperty('loading', true);
    try {
      console.log('Submitting data to:', url, 'with formData:', formData);

      const response = await apiRequest({
        url,
        method: 'POST',
        data: formData,
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log('API Response:', response);

      if (response.status === 201 && response.data.success) {
        this.addProducts(formData.products_details);
        this.setAppProperty('error', null);
        return { success: true, response };
      } else {
        console.error('Submit failed:', response.data);
        this.setAppProperty(
          'error',
          response.data.message || 'Submission failed.'
        );
        return { success: false, response };
      }
    } catch (error) {
      console.error('API Error:', error.message);
      this.setAppProperty('error', error.message);
      return { success: false, error };
    } finally {
      this.setAppProperty('loading', false);
    }
  }

  async uploadFile(category, file) {
    const baseUrl = this.getApiBaseUrl(category);
    const url = `${baseUrl}/upload`;

    this.setAppProperty('loading', true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await apiRequest({
        url,
        method: 'POST',
        data: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Upload Response:', response);

      if (response.status === 201 && response.data.id) {
        console.log('File uploaded successfully:', response.data);
        this.setAppProperty('error', null);
        return { success: true, id: response.data.id };
      } else {
        console.error('Upload failed:', response.data);
        this.setAppProperty('error', response.data.message || 'Upload failed');
        return { success: false, error: response.data.message };
      }
    } catch (error) {
      console.error('Upload Error:', error.message);
      this.setAppProperty('error', error.message);
      return { success: false, error: error.message };
    } finally {
      this.setAppProperty('loading', false);
    }
  }

  async deleteFile(category, fileId) {
    if (!category || typeof category !== 'string') {
      throw new Error('Valid category string is required for file deletion');
    }

    const baseUrl = this.getApiBaseUrl(category);
    const url = `${baseUrl}/deleteFile/${fileId}`;

    this.setAppProperty('loading', true);
    try {
      const response = await apiRequest({
        url,
        method: 'POST',
      });

      if (response.status === 200 && response.data.success) {
        console.log('File deleted successfully:', response.data);
        this.setAppProperty('error', null);
        return { success: true, message: response.data.message };
      } else {
        console.error('Delete failed:', response.data);
        this.setAppProperty(
          'error',
          response.data.message || 'Failed to delete file.'
        );
        return { success: false, error: response.data.message };
      }
    } catch (error) {
      console.error('Delete Error:', error.message);
      this.setAppProperty('error', error.message);
      return { success: false, error: error.message };
    } finally {
      this.setAppProperty('loading', false);
    }
  }
}

export default AppStore;
