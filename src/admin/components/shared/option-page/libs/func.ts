import { FormInstance } from "antd";
import { Image as ImageType } from "@medusajs/medusa";

type TImageUpdate = {
    formName: string;
    fieldName: string;
    index?: number;
}

export const handleImageSelect = (files: ImageType[], form: FormInstance<any>, imageUpdate: TImageUpdate, toggle: () => void) => {
    if (!imageUpdate) return;
    const newImageUrl = files[0].url;

    const currentDataValues = form.getFieldValue(imageUpdate.formName);

    if (Array.isArray(currentDataValues)) {
        const newDataValues = [...currentDataValues];
        if (newDataValues[imageUpdate.index]) {
            newDataValues[imageUpdate.index][imageUpdate.fieldName] = newImageUrl;
        } else {
            newDataValues[imageUpdate.index] = {
                [imageUpdate.fieldName]: newImageUrl,
            };
        }
        form.setFieldsValue({ [imageUpdate.formName]: newDataValues });
    } else {
        let newDataValues = { ...currentDataValues };
        if (newDataValues[imageUpdate.fieldName]) {
            newDataValues[imageUpdate.fieldName] = newImageUrl;
        } else {
            newDataValues = {
                [imageUpdate.fieldName]: newImageUrl,
            };
        }
        form.setFieldsValue({ [imageUpdate.formName]: newDataValues });
    }

    toggle();
};