import React from 'react';

// Espejo de templates/sample-template.txt — CRA no permite importar .txt sin eject,
// por eso el contenido vive aquí como constante.
const SAMPLE_TEMPLATE = `ID del Caso: {{id_caso}}
Nombre del Deudor: {{nombre_deudor}}
Tipo de Identificación: {{tipo_identificacion}}
Número de Identificación: {{numero_identificacion}}
Dirección: {{direccion}}
Teléfonos: {{telefonos}}
Correos: {{correos}}
Nombre Acreedor: {{nombre_acreedor}}
Número de Obligación: {{numero_obligacion}}
Valor Adeudado: {{valor_adeudado}}
Tipo de Garantía: {{tipo_garantia}}
Abogado Responsable: {{abogado_responsable}}
Fecha Vencimiento Original: {{fecha_vencimiento}}
Fecha Inicio Mora: {{fecha_inicio_mora}}

Comentarios: {{comentarios}}`;

const TEMPLATES: Array<{ name: string; content: string }> = [
    { name: 'Plantilla básica de demanda', content: SAMPLE_TEMPLATE },
];

interface TemplateSelectorProps {
    onTemplateSelect: (template: string) => void;
}

export const TemplateSelector: React.FC<TemplateSelectorProps> = ({ onTemplateSelect }) => {
    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selected = TEMPLATES.find(t => t.name === e.target.value);
        if (selected) {
            onTemplateSelect(selected.content);
        }
    };

    return (
        <div>
            <label>Plantilla: </label>
            <select defaultValue="" onChange={handleChange}>
                <option value="" disabled>Seleccione una plantilla...</option>
                {TEMPLATES.map(t => (
                    <option key={t.name} value={t.name}>{t.name}</option>
                ))}
            </select>
        </div>
    );
};

export default TemplateSelector;
