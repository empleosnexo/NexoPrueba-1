/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronRight, 
  CheckCircle2, 
  Send, 
  Smartphone, 
  Mail, 
  FileText, 
  UserPlus, 
  Loader2,
  ArrowRight
} from 'lucide-react';

// NEXO Logo Component
const NexoLogo = ({ className = "h-8" }: { className?: string }) => (
  <svg viewBox="0 0 200 60" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 10L50 50V10H65V50L35 10V50H20V10Z" fill="#1a237e"/>
    <path d="M80 10H110V20H80V25H105V35H80V40H110V50H80V10Z" fill="#1a237e"/>
    <path d="M120 10L135 30L120 50H135L145 35L155 50H170L155 30L170 10H155L145 25L135 10H120Z" fill="#2e7d32"/>
    <path d="M180 10C190 10 200 20 200 30C200 40 190 50 180 50C170 50 160 40 160 30C160 20 170 10 180 10ZM180 20C175 20 170 25 170 30C170 35 175 40 180 40C185 40 190 35 190 30C190 25 185 20 180 20Z" fill="#1a237e"/>
  </svg>
);

export default function App() {
  const [formData, setFormData] = useState({
    nombre: '',
    puesto: '',
    localidad: '',
    salario: '',
    whatsapp: '',
    email: '',
    servicio: '',
    archivo: null as File | null
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({ ...prev, archivo: e.target.files![0] }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Función para convertir archivo a Base64
    const toBase64 = (file: File): Promise<string> => new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64String = (reader.result as string).split(',')[1];
        resolve(base64String);
      };
      reader.onerror = error => reject(error);
    });

    try {
      let archivoB64 = '';
      let archivoMimeType = '';

      if (formData.archivo) {
        archivoB64 = await toBase64(formData.archivo);
        archivoMimeType = formData.archivo.type;
      }

      const payload = {
        ...formData,
        archivoB64,
        archivoMimeType,
        archivo: null // No enviamos el objeto File original
      };

      // REEMPLAZA ESTA URL CON LA QUE COPIASTE DE GOOGLE APPS SCRIPT
      const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzlzAh3xL0JoxpZJMHGLlfGa4ssVrDpbWa_ldzUojr3VS1tiOLr1nFsL-24RuNhKeTh/exec';

      const response = await fetch(SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors', // Importante para Google Scripts
        body: JSON.stringify(payload),
        headers: {
          'Content-Type': 'application/json'
        }
      });

      // Nota: con 'no-cors' no podemos leer response.ok, 
      // pero si no hay error en el fetch, asumimos éxito.
      setIsSuccess(true);
      
      // Limpiar formulario
      setFormData({
        nombre: '',
        puesto: '',
        localidad: '',
        salario: '',
        whatsapp: '',
        email: '',
        servicio: '',
        archivo: null
      });

    } catch (error) {
      console.error("Error al enviar:", error);
      alert("Hubo un error al enviar tu postulación. Por favor intentá de nuevo.");
    } finally {
      setIsSubmitting(false);
      
      // Ocultar mensaje de éxito después de 5 segundos
      setTimeout(() => setIsSuccess(false), 5000);
    }
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col selection:bg-emerald-100 selection:text-emerald-900">
      {/* HEADER */}
      <header className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md z-50 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <NexoLogo className="h-8 md:h-10" />
          <button 
            onClick={() => scrollToSection('como-funciona')}
            className="bg-[#1a237e] text-white px-5 py-2 rounded-full font-semibold text-sm hover:bg-[#1a237e]/90 transition-all active:scale-95"
          >
            Cómo funciona
          </button>
        </div>
      </header>

      <main className="flex-grow pt-20">
        {/* HERO SECTION */}
        <section className="relative overflow-hidden py-20 md:py-32 bg-white">
          <div className="max-w-7xl mx-auto px-4 relative z-10">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center max-w-3xl mx-auto"
            >
              <h1 className="text-4xl md:text-6xl font-extrabold text-[#1a237e] leading-tight mb-6">
                Estás a solo un paso de <span className="text-[#2e7d32]">optimizar tu curriculum</span>
              </h1>
              <p className="text-xl md:text-2xl text-slate-600 mb-10 font-medium">
                Somos el nexo entre vos y las empresas.
              </p>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => scrollToSection('postulacion')}
                className="bg-[#2e7d32] text-white px-10 py-4 rounded-2xl font-bold text-lg shadow-xl shadow-emerald-200 hover:bg-[#2e7d32]/90 transition-all flex items-center justify-center mx-auto gap-2"
              >
                Postularme Ahora <ArrowRight size={20} />
              </motion.button>
            </motion.div>
          </div>
          
          {/* Background Accents */}
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-emerald-50 rounded-full blur-3xl opacity-50 -z-10"></div>
          <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-96 h-96 bg-indigo-50 rounded-full blur-3xl opacity-50 -z-10"></div>
        </section>

        {/* VALOR / SERVICIOS */}
        <section className="py-20 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-8">
              <motion.div 
                whileHover={{ y: -10 }}
                className="bg-[#1a237e] p-10 rounded-3xl text-white shadow-2xl shadow-indigo-200"
              >
                <div className="bg-white/10 w-14 h-14 rounded-2xl flex items-center justify-center mb-6">
                  <FileText size={30} />
                </div>
                <h3 className="text-2xl font-bold mb-4">A. Optimizar mi CV</h3>
                <p className="text-indigo-100 text-lg opacity-90">
                  ¿Ya tenés un CV pero no te llaman? Lo transformamos para que destaque ante cualquier reclutador.
                </p>
              </motion.div>

              <motion.div 
                whileHover={{ y: -10 }}
                className="bg-[#2e7d32] p-10 rounded-3xl text-white shadow-2xl shadow-emerald-200"
              >
                <div className="bg-white/10 w-14 h-14 rounded-2xl flex items-center justify-center mb-6">
                  <UserPlus size={30} />
                </div>
                <h3 className="text-2xl font-bold mb-4">B. Armar CV desde cero</h3>
                <p className="text-emerald-50 text-lg opacity-90">
                  ¿Es tu primer paso? No te preocupes. Armamos tu perfil profesional desde la base, resaltando tu potencial.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* PROCESO */}
        <section id="como-funciona" className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#1a237e] text-center mb-16">
              Cruzá el puente en 3 pasos
            </h2>
            
            <div className="grid md:grid-cols-3 gap-12 relative">
              {/* Step 1 */}
              <div className="text-center relative">
                <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6 text-[#1a237e]">
                  <Smartphone size={32} />
                </div>
                <h4 className="text-xl font-bold mb-3">Postulación en la Web</h4>
                <p className="text-slate-600">Elegís tu opción y nos dejás tus datos en el formulario.</p>
              </div>

              {/* Step 2 */}
              <div className="text-center relative">
                <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6 text-[#2e7d32]">
                  <Mail size={32} />
                </div>
                <h4 className="text-xl font-bold mb-3">Contacto Rápido (&lt;24hs)</h4>
                <p className="text-slate-600">Te escribimos por Mail para coordinar la reunión virtual.</p>
              </div>

              {/* Step 3 */}
              <div className="text-center relative">
                <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6 text-[#1a237e]">
                  <CheckCircle2 size={32} />
                </div>
                <h4 className="text-xl font-bold mb-3">Entrega del Kit Nexo</h4>
                <p className="text-slate-600">Recibís tu CV de alto impacto y perfil de LinkedIn listo.</p>
              </div>
            </div>
          </div>
        </section>

        {/* FORMULARIO */}
        <section id="postulacion" className="py-20 bg-slate-50">
          <div className="max-w-3xl mx-auto px-4">
            <div className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-xl border border-slate-100">
              <div className="text-center mb-10">
                <h2 className="text-3xl font-extrabold text-[#1a237e] mb-2">¿Estás listo para dar el salto?</h2>
                <p className="text-slate-500">Completá esto y te contactamos en menos de 24hs.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 ml-1">Nombre Completo</label>
                    <input 
                      type="text" 
                      name="nombre"
                      required
                      value={formData.nombre}
                      onChange={handleInputChange}
                      placeholder="Ej: Juan Pérez"
                      className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 ml-1">Puesto deseado</label>
                    <input 
                      type="text" 
                      name="puesto"
                      required
                      value={formData.puesto}
                      onChange={handleInputChange}
                      placeholder="Ej: Administrativo, Ventas..."
                      className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 ml-1">Localidad</label>
                    <input 
                      type="text" 
                      name="localidad"
                      required
                      value={formData.localidad}
                      onChange={handleInputChange}
                      placeholder="Ej: CABA, Buenos Aires"
                      className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 ml-1">Salario requerido</label>
                    <input 
                      type="text" 
                      name="salario"
                      required
                      value={formData.salario}
                      onChange={handleInputChange}
                      placeholder="Ej: $500.000"
                      className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 ml-1">WhatsApp</label>
                    <input 
                      type="tel" 
                      name="whatsapp"
                      required
                      value={formData.whatsapp}
                      onChange={handleInputChange}
                      placeholder="Ej: 11 1234 5678"
                      className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 ml-1">Email</label>
                    <input 
                      type="email" 
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="tu@email.com"
                      className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">¿Qué necesitás?</label>
                  <select 
                    name="servicio"
                    required
                    value={formData.servicio}
                    onChange={handleInputChange}
                    className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-indigo-500 transition-all outline-none appearance-none cursor-pointer"
                  >
                    <option value="">Seleccioná una opción</option>
                    <option value="A">A. Optimizar mi CV</option>
                    <option value="B">B. Armar CV desde cero</option>
                  </select>
                </div>

                <AnimatePresence>
                  {formData.servicio === 'A' && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-2 overflow-hidden"
                    >
                      <label className="text-sm font-bold text-slate-700 ml-1">Subir tu CV actual (PDF)</label>
                      <div className="relative">
                        <input 
                          type="file" 
                          accept=".pdf"
                          required={formData.servicio === 'A'}
                          onChange={handleFileChange}
                          className="w-full px-5 py-4 rounded-2xl bg-indigo-50 border-2 border-dashed border-indigo-200 text-indigo-600 file:hidden cursor-pointer hover:bg-indigo-100 transition-all"
                        />
                        <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-indigo-400">
                          {formData.archivo ? <CheckCircle2 size={20} className="text-emerald-500" /> : <FileText size={20} />}
                        </div>
                        <p className="text-xs text-indigo-400 mt-1 ml-1">
                          {formData.archivo ? `Archivo: ${formData.archivo.name}` : 'Solo archivos PDF'}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#2e7d32] text-white py-5 rounded-2xl font-bold text-xl shadow-lg shadow-emerald-100 hover:bg-[#2e7d32]/90 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="animate-spin" /> Enviando...
                    </>
                  ) : (
                    <>
                      ¡Quiero recibir mi cv! <Send size={20} />
                    </>
                  )}
                </button>
              </form>

              <AnimatePresence>
                {isSuccess && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mt-8 p-6 bg-emerald-50 border border-emerald-100 rounded-3xl text-center"
                  >
                    <CheckCircle2 className="mx-auto text-emerald-500 mb-3" size={40} />
                    <h4 className="text-emerald-900 font-bold text-xl mb-1">¡Postulación Recibida, {formData.nombre.split(' ')[0]}!</h4>
                    <p className="text-emerald-700">Te escribimos por WhatsApp en menos de 24hs.</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="bg-white border-t border-slate-100 py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <NexoLogo className="h-8 mx-auto mb-6" />
          <p className="text-slate-500 font-medium mb-8">
            Somos el Nexo entre vos y lo que estabas buscando.
          </p>
          <div className="text-slate-400 text-sm">
            NEXO © 2024. Todos los derechos reservados.
          </div>
        </div>
      </footer>

      {/* INSTRUCCIONES PARA GOOGLE SHEETS / EMAIL */}
      {/* 
        Para conectar esto a un Google Sheet y recibir los PDFs por mail:
        
        OPCIÓN A (Fácil): Usar Formspree.io
        1. Registrate en Formspree.io
        2. Creá un nuevo formulario y obtené el ID (ej: https://formspree.io/f/tu_id)
        3. En el componente handleSubmit, reemplazá la simulación por:
           const response = await fetch('https://formspree.io/f/tu_id', {
             method: 'POST',
             body: new FormData(e.target),
             headers: { 'Accept': 'application/json' }
           });
        4. Formspree te enviará los datos al mail (empleos.nexo@gmail.com) y podés conectarlo a Google Sheets desde su panel.

        OPCIÓN B (Personalizada): Google Apps Script
        1. Creá un Google Sheet.
        2. Extensiones -> Apps Script.
        3. Pegá un script que reciba el POST, guarde en la fila y use MailApp.sendEmail para mandarte el PDF.
        4. Publicá como Web App y usá esa URL en el fetch.
      */}
    </div>
  );
}
