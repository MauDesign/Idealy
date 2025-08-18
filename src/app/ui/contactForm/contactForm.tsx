'use client'
import { useTranslations } from 'next-intl'
import React, { useState, ChangeEvent, } from "react";

type SubmissionStatus = 'success' | 'error' | null;


export default function ContactForm() {
    const t = useTranslations("ContactForm");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submissionStatus, setSubmissionStatus] = useState<SubmissionStatus>(null);
    
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmissionStatus(null);

        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                setSubmissionStatus('success');
                // Resetear el formulario solo si el envío fue exitoso
                setFormData({
                    name: '',
                    email: '',
                    subject: '',
                    message: ''
                });
            } else {
                throw new Error('Failed to send message');
            }
        } catch (error) {
            console.error(error);
            setSubmissionStatus('error');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="form-control w-full">
                <label htmlFor="name"  className="label"> {t("name")} </label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    placeholder = {t("nameholder")}                    
                    value={formData.name}
                    onChange={handleChange}
                    className="input input-bordered w-full p-1"
                    required
                />
            </div>
            <div className="form-control w-full">
                <label htmlFor="email"  className="label"> {t("email")} </label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="input input-bordered w-full p-1"
                    placeholder={t("emailholder")}
                    required
                />
            </div>
            <div className="form-control w-full">
                <label htmlFor="subject"  className="label"> {t("subject")} </label>
                <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder={t("subjectholder")} 
                    className="input input-bordered w-full p-1"
                    required
                />
            </div>
            <div className="form-control w-full">
                <label htmlFor="message"  className="label"> {t("message")} </label>
                <textarea
                    id="message"
                    name="message"
                    className='textarea texarea-bordered w-full'
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    required
                />
            </div>
            <button type="submit" className='btn btn-primary w-full mt-2' disabled={isSubmitting}>
                {isSubmitting ? t('submitting') : t("submit")}
            </button>
            {submissionStatus === 'success' && (
                <div className="alert alert-success">{t('successMessage')}</div>
            )}
            {submissionStatus === 'error' && (
                <div className="alert alert-error">{t('errorMessage')}</div>
            )}
        </form>
    );
}
