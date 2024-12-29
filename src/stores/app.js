import { makeAutoObservable } from "mobx";
import { AuthStatuses } from "../utils/constants";

import apiRequest from "../utils/apiRequest";

//import { getLocalStorageItem, setLocalStorageItem } from '@/utils/storage';

class AppStore {
  authStatus = AuthStatuses.UNAUTHENTICATED;
  partnerInfo = {};
  products = [];
  loading = false;
  error = null;

  constructor() {
    makeAutoObservable(this);
  }

  get getPartnerInfo() {
    return this.partnerInfo;
  }

  updatePartnerInfo = (partnerInfo) => {
    this.partnerInfo = partnerInfo;
  };

  setAppProperty = (property, value) => {
    this[property] = value;
  };

  addProducts = (productsDetails) => {
    this.products = productsDetails;
  };

  async uploadFile(file) {
    this.setAppProperty("loading", true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await apiRequest({
        url: "mic-login/partner/upload",
        method: "post",
        data: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Upload Response:", response);

      if (response.status === 201 && response.data.id) {
        this.setAppProperty("error", null);
        return { success: true, id: response.data.id };
      }

      this.setAppProperty("error", "Upload failed");
      return {
        success: false,
        error: response.data.message || "Upload failed",
      };
    } catch (error) {
      console.error("Upload Error:", error);
      this.setAppProperty("error", error.message);
      return { success: false, error: error.message };
    } finally {
      this.setAppProperty("loading", false);
    }
  }

  async submitProducts(data) {
    this.setAppProperty("loading", true);
    try {
      console.log("Submitting request:", data);

      const response = await apiRequest({
        url: "mic-login/partner/addProducts",
        method: "post",
        data: data,
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status === 201 && response.data.success) {
        this.addProducts(data.products_details);
        this.setAppProperty("error", null);
        return { success: true, response };
      } else {
        console.error("Invalid Response Structure:", response.data);
        this.setAppProperty(
          "error",
          response.data.message || "Submission failed."
        );
        return { success: false, response };
      }
    } catch (error) {
      console.error("API Error:", error.message);
      this.setAppProperty("error", error.message);
      return { success: false, error };
    } finally {
      this.setAppProperty("loading", false);
    }
  }

  async deleteFile(fileId) {
    this.setAppProperty("loading", true);
    try {
      const response = await apiRequest({
        url: `/mic-login/partner/deleteFile/${fileId}`,
        method: "post",
      });

      if (response.status === 200 && response.data.success) {
        this.setAppProperty("error", null);
        return { success: true, message: response.data.message };
      } else {
        throw new Error(response.data.message || "Failed to delete file.");
      }
    } catch (error) {
      console.error("Delete File Error:", error.message);
      this.setAppProperty("error", error.message);
      return { success: false, error: error.message };
    } finally {
      this.setAppProperty("loading", false);
    }
  }
}

export default AppStore;
