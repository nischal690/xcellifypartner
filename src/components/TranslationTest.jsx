import React from 'react'
import { useTranslation } from 'react-i18next'

export default function TranslationTest() {
    const {t} = useTranslation();
  return (
    <div>{t('welcome_message')}</div>
  )
}
