import { useEffect, useState } from "react";
import { getContent } from "../api/api";

const DEFAULTS = {
  phone: "+91 98765 43210",
  whatsapp: "919876543210",
  email: "info@leelatours.com",
  facebook: "https://www.facebook.com/leelatours",
  instagram: "https://www.instagram.com/leelatours",
};

const sanitizeWhatsapp = (value) => {
  const digits = String(value || "").replace(/\D/g, "");
  return digits || DEFAULTS.whatsapp;
};

const normalize = (contact = {}) => ({
  ...DEFAULTS,
  ...contact,
  whatsapp: sanitizeWhatsapp(contact.whatsapp),
  phone: contact.phone || DEFAULTS.phone,
  facebook: contact.facebook || DEFAULTS.facebook,
  instagram: contact.instagram || DEFAULTS.instagram,
});

let cachedContact = null;
let pendingRequest = null;

const loadContact = () => {
  if (cachedContact) return Promise.resolve(cachedContact);

  if (!pendingRequest) {
    pendingRequest = getContent()
      .then((res) => {
        cachedContact = normalize(res.data?.content?.contact);
        return cachedContact;
      })
      .catch(() => DEFAULTS)
      .finally(() => {
        pendingRequest = null;
      });
  }

  return pendingRequest;
};

export default function useContact() {
  const [contact, setContact] = useState(cachedContact || DEFAULTS);

  useEffect(() => {
    let active = true;
    loadContact().then((value) => {
      if (active) setContact(value);
    });
    return () => {
      active = false;
    };
  }, []);

  return contact;
}
