'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { useMeta } from '@/context/MetaContext';
import Link from 'next/link';
import toast from 'react-hot-toast';
import * as LucideIcons from 'lucide-react';
import DashboardHeader from '@/components/DashboardHeader';

interface Section {
    name: string;
    file: string;
    description: string;
}

const sections: Section[] = [
    { name: 'Hero', file: 'hero.json', description: 'Main hero section content' },
    { name: 'About', file: 'about.json', description: 'About section information' },
    { name: 'Services', file: 'services.json', description: 'Services offered' },
    { name: 'Numbers', file: 'numbersHome.json', description: 'Statistics and numbers' },
    { name: 'Values', file: 'values.json', description: 'Company values' },
    { name: 'Case Studies', file: 'caseStudies.json', description: 'Case studies showcase' },
    { name: 'FAQ', file: 'faq.json', description: 'Frequently asked questions' },
    { name: 'Footer', file: 'footer.json', description: 'Footer content' },
    { name: 'Header', file: 'header.json', description: 'Navigation and header' },
    { name: 'CTA', file: 'cta.json', description: 'Call to action content' },
    { name: 'Meta', file: 'meta.json', description: 'Global site settings, colors, SEO, fonts' },
];

export default function SectionPage() {
    const { user, token, logout } = useAuth();
    const { theme } = useTheme();
    const { updateMeta } = useMeta();
    const router = useRouter();
    const params = useParams();
    const sectionName = params.section as string;

    const [sectionData, setSectionData] = useState<any>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [showDownloadModal, setShowDownloadModal] = useState(false);
    const [selectedFormat, setSelectedFormat] = useState<'csv' | 'excel' | 'json' | null>(null);
    const [showSaveModal, setShowSaveModal] = useState(false);
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [pendingUpload, setPendingUpload] = useState<{ file: File; path: string } | null>(null);
    const [iconPickerOpen, setIconPickerOpen] = useState<string | null>(null);
    const [iconSearchTerm, setIconSearchTerm] = useState('');

    const currentSection = sections.find(s => s.name.toLowerCase().replace(' ', '-') === sectionName);

    useEffect(() => {
        if (!token) {
            router.push('/login');
            return;
        }

        if (!currentSection) {
            router.push('/dashboard');
            return;
        }

        loadSectionData();
    }, [token, currentSection, router]);

    const loadSectionData = async () => {
        try {
            const res = await fetch(`/SiteContent/${currentSection!.file}`);
            const data = await res.json();
            setSectionData(data);
            setLoading(false);
        } catch (error) {
            console.error('Error loading section data:', error);
            setLoading(false);
        }
    };

    const saveSectionData = async () => {
        if (user && sectionData && currentSection) {
            try {
                const response = await fetch('/api/update-section', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        sectionName: currentSection.file.replace('.json', ''),
                        data: sectionData,
                    }),
                });

                const result = await response.json();

                if (result.success) {
                    toast.success('Data saved successfully!');
                    setIsEditing(false);
                    setShowSaveModal(false);
                    // Reload the section data to reflect changes
                    loadSectionData();
                    // If meta was updated, update the context
                    if (currentSection.file === 'meta.json') {
                        updateMeta(sectionData);
                    }
                } else {
                    toast.error('Failed to save data: ' + result.error);
                }
            } catch (error) {
                console.error('Error saving data:', error);
                toast.error('Failed to save data');
            }
        }
    };

    const handleInputChange = (path: string, value: any) => {
        const keys = path.split('.');
        const newData = { ...sectionData };
        let current = newData;
        for (let i = 0; i < keys.length - 1; i++) {
            if (!current[keys[i]]) current[keys[i]] = {};
            current = current[keys[i]];
        }
        current[keys[keys.length - 1]] = value;
        setSectionData(newData);
    };

    const handleArrayItemChange = (arrayPath: string, index: number, fieldPath: string, value: any) => {
        const newData = { ...sectionData };
        let current = newData;
        const keys = arrayPath.split('.');
        for (let i = 0; i < keys.length; i++) {
            if (!current[keys[i]]) current[keys[i]] = [];
            current = current[keys[i]];
        }
        if (!current[index]) current[index] = {};
        const fieldKeys = fieldPath.split('.');
        let itemCurrent = current[index];
        for (let i = 0; i < fieldKeys.length - 1; i++) {
            if (!itemCurrent[fieldKeys[i]]) itemCurrent[fieldKeys[i]] = {};
            itemCurrent = itemCurrent[fieldKeys[i]];
        }
        itemCurrent[fieldKeys[fieldKeys.length - 1]] = value;
        setSectionData(newData);
    };

    const addArrayItem = (arrayPath: string) => {
        const newData = { ...sectionData };
        let current = newData;
        const keys = arrayPath.split('.');
        for (let i = 0; i < keys.length; i++) {
            if (!current[keys[i]]) current[keys[i]] = [];
            current = current[keys[i]];
        }

        // Create template based on array type
        let newItem: any = '';

        // Get the last segment of the path to determine array type
        const pathSegments = arrayPath.split('.');
        const lastSegment = pathSegments[pathSegments.length - 1];

        if (lastSegment === 'services') {
            newItem = {
                title: '',
                overview: '',
                image: '',
                description: '',
                features: ['']
            };
        } else if (lastSegment === 'faqs') {
            newItem = {
                question: '',
                answer: ''
            };
        } else if (lastSegment === 'values') {
            newItem = {
                iconName: '',
                title: '',
                description: ''
            };
        } else if (lastSegment === 'caseStudies') {
            newItem = {
                title: '',
                description: '',
                image: '',
                link: ''
            };
        } else if (lastSegment === 'stats') {
            newItem = {
                icon: '',
                number: '',
                description: ''
            };
        } else if (lastSegment === 'schedule') {
            newItem = {
                days: '',
                time: ''
            };
        } else if (lastSegment === 'items') {
            newItem = {
                label: '',
                link: ''
            };
        } else if (lastSegment === 'features') {
            // Features are always strings
            newItem = '';
        } else if (current.length > 0) {
            // For other arrays, use the first item as template
            const firstItem = current[0];
            if (typeof firstItem === 'object' && firstItem !== null) {
                newItem = JSON.parse(JSON.stringify(firstItem));
                // Clear the values but keep the structure
                const clearObject = (obj: any) => {
                    for (const key in obj) {
                        if (typeof obj[key] === 'string') {
                            obj[key] = '';
                        } else if (Array.isArray(obj[key])) {
                            obj[key] = obj[key].map(() => '');
                        } else if (typeof obj[key] === 'object' && obj[key] !== null) {
                            clearObject(obj[key]);
                        }
                    }
                };
                clearObject(newItem);
            } else if (typeof firstItem === 'string') {
                newItem = '';
            }
        } else {
            // Empty array - try to infer type from parent context
            const parentPath = pathSegments.slice(0, -1).join('.');
            if (parentPath.includes('services') && lastSegment === 'features') {
                newItem = '';
            } else {
                // Default to empty object for unknown arrays
                newItem = {};
            }
        }

        current.push(newItem);
        setSectionData(newData);
    };

    const removeArrayItem = (arrayPath: string, index: number) => {
        const newData = { ...sectionData };
        let current = newData;
        const keys = arrayPath.split('.');
        for (let i = 0; i < keys.length; i++) {
            current = current[keys[i]];
        }
        current.splice(index, 1);
        setSectionData(newData);
    };

    const handleImageUpload = async (file: File, path: string) => {
        setPendingUpload({ file, path });
        setShowUploadModal(true);
    };

    const confirmImageUpload = async () => {
        if (!pendingUpload) return;

        const { file, path } = pendingUpload;
        const formData = new FormData();
        formData.append('file', file);

        // Check if this is a favicon upload
        const isFavicon = path.includes('favicon');
        const sectionNameForUpload = isFavicon ? 'favicon' : currentSection!.name.toLowerCase().replace(' ', '-');

        formData.append('sectionName', sectionNameForUpload);

        try {
            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });

            const result = await response.json();

            if (result.success) {
                // Check if this is an array item path (contains numbers)
                const pathParts = path.split('.');
                const hasIndex = pathParts.some(part => /^\d+$/.test(part));

                if (hasIndex) {
                    // Handle array item image upload
                    const arrayPath = pathParts.slice(0, -2).join('.'); // Remove index and field
                    const index = parseInt(pathParts[pathParts.length - 2]);
                    const fieldPath = pathParts[pathParts.length - 1];
                    handleArrayItemChange(arrayPath, index, fieldPath, result.path);
                } else {
                    handleInputChange(path, result.path);
                }
                toast.success('Image uploaded successfully!');
                setShowUploadModal(false);
                setPendingUpload(null);
            } else {
                toast.error('Upload failed: ' + result.error);
            }
        } catch (error) {
            console.error('Upload error:', error);
            toast.error('Upload failed');
        }
    };

    const handleDownload = async (format: 'csv' | 'excel' | 'json') => {
        setSelectedFormat(format);
        setShowDownloadModal(true);
    };

    const executeDownload = async (includeImages: boolean) => {
        try {
            const sectionFile = currentSection!.file.replace('.json', '');
            const response = await fetch(`/api/download-section?section=${sectionFile}&format=${selectedFormat}&includeImages=${includeImages}`);

            if (!response.ok) {
                throw new Error('Download failed');
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            const extension = includeImages ? 'zip' : (selectedFormat === 'excel' ? 'xlsx' : selectedFormat);
            a.download = `${sectionFile}_${selectedFormat}.${extension}`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
            setShowDownloadModal(false);
        } catch (error) {
            console.error('Download error:', error);
            toast.error('Download failed');
        }
    };

    const AVAILABLE_FONTS = [
        'Arial',
        'Verdana',
        'Times New Roman',
        'Courier New',
        'Georgia',
        'Palatino',
        'Garamond',
        'Bookman',
        'Comic Sans MS',
        'Trebuchet MS',
        'Impact',
        'Lucida Console',
        'Tahoma',
        'Lucida Handwriting',
        'Geist'
    ];

    // Get all available Lucide icon names
    const AVAILABLE_ICONS = Object.keys(LucideIcons)
        .filter(key => {
            // Filter out non-icon exports (createLucideIcon, Icon interface, etc.)
            if (key === 'createLucideIcon' || key === 'Icon' || key === 'icons' || key === 'default') {
                return false;
            }
            // Check if it's a valid component (function or object with render method)
            const value = (LucideIcons as any)[key];
            return typeof value === 'function' || (typeof value === 'object' && value !== null);
        })
        .sort();

    const renderField = (key: string, value: any, path: string = key) => {
        // Check if this is an icon field (icon, iconName, or ends with Icon)
        if (typeof value === 'string' && (key === 'icon' || key === 'iconName' || key.toLowerCase().endsWith('icon')) && !key.toLowerCase().includes('background') && !key.toLowerCase().includes('image')) {
            const IconComponent = (LucideIcons as any)[value];
            const isOpen = iconPickerOpen === path;

            // Only filter when searching, otherwise show first 100 - this improves performance
            const filteredIcons = iconSearchTerm
                ? AVAILABLE_ICONS.filter(iconName =>
                    iconName.toLowerCase().includes(iconSearchTerm.toLowerCase())
                ).slice(0, 200) // Limit search results to 200
                : AVAILABLE_ICONS.slice(0, 100); // Show first 100 when not searching

            const displayIcons = filteredIcons;

            return (
                <div key={path} className="mb-4 relative">
                    <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                        {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    </label>

                    {/* Custom Icon Picker Button */}
                    <button
                        type="button"
                        onClick={(e) => {
                            e.preventDefault();
                            setIconPickerOpen(isOpen ? null : path);
                            setIconSearchTerm('');
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2 border rounded-md ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white hover:bg-gray-600' : 'bg-white border-gray-300 hover:bg-gray-50'}`}
                    >
                        <div className="flex items-center gap-2">
                            {IconComponent ? (
                                <>
                                    <IconComponent className="w-5 h-5" />
                                    <span>{value}</span>
                                </>
                            ) : (
                                <span className="text-gray-400">Select an icon...</span>
                            )}
                        </div>
                        <svg className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>

                    {/* Dropdown Panel */}
                    {isOpen && (
                        <>
                            <div
                                className="fixed inset-0 z-10"
                                onClick={() => setIconPickerOpen(null)}
                            />
                            <div className={`absolute z-20 mt-1 w-full max-h-80 overflow-hidden rounded-md shadow-lg border ${theme === 'dark' ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-300'}`}>
                                {/* Search Input */}
                                <div className="p-2 border-b border-gray-200 dark:border-gray-600">
                                    <input
                                        type="text"
                                        value={iconSearchTerm}
                                        onChange={(e) => setIconSearchTerm(e.target.value)}
                                        placeholder="Search icons..."
                                        className={`w-full px-3 py-2 border rounded-md text-sm ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 placeholder-gray-500'}`}
                                        onClick={(e) => e.stopPropagation()}
                                        autoFocus
                                    />
                                </div>

                                {/* Icons Grid */}
                                <div className="overflow-y-auto max-h-64 p-2">
                                    {displayIcons.length > 0 ? (
                                        <>
                                            <div className="grid grid-cols-4 gap-1">
                                                {displayIcons.map((iconName) => {
                                                    const Icon = (LucideIcons as any)[iconName];
                                                    return (
                                                        <button
                                                            key={iconName}
                                                            type="button"
                                                            onClick={() => {
                                                                handleInputChange(path, iconName);
                                                                setIconPickerOpen(null);
                                                                setIconSearchTerm('');
                                                            }}
                                                            className={`flex flex-col items-center gap-1 p-2 rounded-md transition-colors ${value === iconName
                                                                ? theme === 'dark' ? 'bg-indigo-600 text-white' : 'bg-indigo-100 text-indigo-700'
                                                                : theme === 'dark' ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-700'
                                                                }`}
                                                            title={iconName}
                                                        >
                                                            {Icon && <Icon className="w-5 h-5" />}
                                                            <span className="text-[10px] truncate w-full text-center">{iconName}</span>
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                            {!iconSearchTerm && AVAILABLE_ICONS.length > 100 && (
                                                <div className={`text-center text-xs py-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                                                    Showing 100 of {AVAILABLE_ICONS.length} icons. Use search to find more.
                                                </div>
                                            )}
                                        </>
                                    ) : (
                                        <div className={`p-4 text-center text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                                            No icons found matching "{iconSearchTerm}"
                                        </div>
                                    )}
                                </div>
                            </div>
                        </>
                    )}
                </div>
            );
        }

        // Check if this is a color field in Meta section
        if (currentSection?.file === 'meta.json' && typeof value === 'string' && /^#[0-9A-F]{6}$/i.test(value)) {
            return (
                <div key={path} className="mb-4">
                    <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                        {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    </label>
                    <div className="flex gap-3 items-center">
                        <input
                            type="color"
                            value={value}
                            onChange={(e) => handleInputChange(path, e.target.value)}
                            className="w-16 h-10 rounded-md cursor-pointer"
                        />
                        <input
                            type="text"
                            value={value}
                            onChange={(e) => handleInputChange(path, e.target.value)}
                            className={`flex-1 px-3 py-2 border rounded-md ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                            placeholder="#000000"
                        />
                    </div>
                </div>
            );
        }

        // Check if this is a font field in Meta section
        if (currentSection?.file === 'meta.json' && key === 'fontFamily') {
            return (
                <div key={path} className="mb-4">
                    <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                        Font Family
                    </label>
                    <select
                        value={value}
                        onChange={(e) => handleInputChange(path, e.target.value)}
                        className={`w-full px-3 py-2 border rounded-md ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                    >
                        {AVAILABLE_FONTS.map((font) => (
                            <option key={font} value={font}>
                                {font}
                            </option>
                        ))}
                    </select>
                </div>
            );
        }

        // Check if this is an image field
        if (typeof value === 'string' && (value.startsWith('/images/') || key.toLowerCase().includes('image') || key.toLowerCase().includes('background') || key.toLowerCase() === 'favicon')) {
            // Determine accept attribute based on field name
            const acceptAttr = key.toLowerCase() === 'favicon' ? 'image/png,image/svg+xml,image/x-icon,.ico,.svg,.png' : 'image/*';
            const isFavicon = key.toLowerCase() === 'favicon';

            return (
                <div key={path} className="mb-6">
                    <label className={`block text-sm font-semibold mb-3 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                        {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                        {isFavicon && (
                            <span className={`text-xs ml-2 font-normal ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                                (PNG, SVG, or ICO)
                            </span>
                        )}
                    </label>
                    <div className={`${isFavicon ? 'grid grid-cols-1 md:grid-cols-2 gap-4' : ''}`}>
                        {value && (
                            <div className={`${isFavicon ? 'order-1' : 'mb-3'}`}>
                                <div className={`p-3 border-2 rounded-lg ${theme === 'dark' ? 'bg-gray-800 border-gray-600' : 'bg-gray-50 border-gray-300'}`}>
                                    <p className={`text-xs font-medium mb-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Current {isFavicon ? 'Favicon' : 'Image'}</p>
                                    <img
                                        src={value}
                                        alt="Current"
                                        className={`${isFavicon ? 'w-16 h-16 object-contain' : 'w-full h-32 object-cover'} rounded border ${theme === 'dark' ? 'border-gray-600 bg-white' : 'border-gray-300'}`}
                                    />
                                    <p className={`text-xs mt-2 truncate ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{value}</p>
                                </div>
                            </div>
                        )}
                        <div className={`space-y-3 ${isFavicon ? 'order-2' : ''}`}>
                            <div>
                                <label className={`block text-xs font-medium mb-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                    Upload File
                                </label>
                                <input
                                    type="file"
                                    accept={acceptAttr}
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                            handleImageUpload(file, path);
                                        }
                                    }}
                                    className={`w-full px-3 py-2 border rounded-md text-sm ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-700' : 'bg-white border-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-700'}`}
                                />
                            </div>
                            <div>
                                <label className={`block text-xs font-medium mb-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                    Or Enter URL
                                </label>
                                <input
                                    type="text"
                                    value={value}
                                    onChange={(e) => handleInputChange(path, e.target.value)}
                                    placeholder="/images/..."
                                    className={`w-full px-3 py-2 border rounded-md text-sm ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500' : 'bg-white border-gray-300 placeholder-gray-400'}`}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            );
        }

        if (Array.isArray(value)) {
            // Special handling for header navigation items
            const isHeaderNav = currentSection?.file === 'header.json' && key === 'navigation';

            if (isHeaderNav) {
                return (
                    <div key={path} className="mb-6">
                        <div className="flex justify-between items-center mb-3">
                            <h4 className={`text-md font-semibold ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                                Navigation Items ({value.length})
                            </h4>
                            <button
                                onClick={() => addArrayItem(path)}
                                className="bg-green-600 text-white px-3 py-1 rounded-md hover:bg-green-700 text-sm flex items-center gap-1"
                            >
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                                </svg>
                                Add Menu Item
                            </button>
                        </div>
                        <div className="space-y-3">
                            {value.map((item: any, index) => (
                                <div key={`${path}.${index}`} className={`border rounded-lg p-4 ${theme === 'dark' ? 'border-gray-600 bg-gray-800' : 'border-gray-300 bg-gray-50'}`}>
                                    <div className="flex justify-between items-center mb-3">
                                        <h5 className={`font-semibold ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>
                                            {item.label || `Menu Item ${index + 1}`}
                                        </h5>
                                        <button
                                            onClick={() => {
                                                if (confirm('Are you sure you want to delete this menu item?')) {
                                                    removeArrayItem(path, index);
                                                }
                                            }}
                                            className="text-red-600 hover:text-red-800"
                                        >
                                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                    </div>

                                    {/* Label */}
                                    <div className="mb-3">
                                        <label className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                                            Label
                                        </label>
                                        <input
                                            type="text"
                                            value={item.label || ''}
                                            onChange={(e) => handleArrayItemChange(path, index, 'label', e.target.value)}
                                            className={`w-full px-3 py-2 border rounded-md ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                                            placeholder="Menu label"
                                        />
                                    </div>

                                    {/* Link */}
                                    <div className="mb-3">
                                        <label className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                                            Link
                                        </label>
                                        <input
                                            type="text"
                                            value={item.link || ''}
                                            onChange={(e) => handleArrayItemChange(path, index, 'link', e.target.value)}
                                            className={`w-full px-3 py-2 border rounded-md ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                                            placeholder="/path"
                                        />
                                    </div>

                                    {/* Has Dropdown Checkbox */}
                                    <div className="mb-3">
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={item.hasDropdown || false}
                                                onChange={(e) => {
                                                    const newValue = e.target.checked;
                                                    handleArrayItemChange(path, index, 'hasDropdown', newValue);
                                                    // Initialize dropdownItems array if checking the box
                                                    if (newValue && !item.dropdownItems) {
                                                        handleArrayItemChange(path, index, 'dropdownItems', []);
                                                    }
                                                }}
                                                className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                            />
                                            <span className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                                                Has Dropdown
                                            </span>
                                        </label>
                                    </div>

                                    {/* Dropdown Items */}
                                    {item.hasDropdown && (
                                        <div className={`mt-4 p-3 rounded-md ${theme === 'dark' ? 'bg-gray-700' : 'bg-white'}`}>
                                            <div className="flex justify-between items-center mb-2">
                                                <h6 className={`text-sm font-semibold ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                                                    Dropdown Items ({item.dropdownItems?.length || 0})
                                                </h6>
                                                <button
                                                    onClick={() => {
                                                        const currentItems = item.dropdownItems || [];
                                                        handleArrayItemChange(path, index, 'dropdownItems', [
                                                            ...currentItems,
                                                            { label: '', link: '' }
                                                        ]);
                                                    }}
                                                    className="bg-indigo-600 text-white px-2 py-1 rounded text-xs hover:bg-indigo-700 flex items-center gap-1"
                                                >
                                                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                                                    </svg>
                                                    Add Item
                                                </button>
                                            </div>

                                            <div className="space-y-2">
                                                {item.dropdownItems?.map((dropItem: any, dropIndex: number) => (
                                                    <div key={dropIndex} className={`p-2 rounded border ${theme === 'dark' ? 'border-gray-600 bg-gray-800' : 'border-gray-300 bg-gray-50'}`}>
                                                        <div className="flex justify-between items-center mb-2">
                                                            <span className={`text-xs font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                                                Item {dropIndex + 1}
                                                            </span>
                                                            <button
                                                                onClick={() => {
                                                                    const newDropdownItems = [...item.dropdownItems];
                                                                    newDropdownItems.splice(dropIndex, 1);
                                                                    handleArrayItemChange(path, index, 'dropdownItems', newDropdownItems);
                                                                }}
                                                                className="text-red-600 hover:text-red-800"
                                                            >
                                                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                                                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                                                </svg>
                                                            </button>
                                                        </div>
                                                        <div className="space-y-2">
                                                            <input
                                                                type="text"
                                                                value={dropItem.label || ''}
                                                                onChange={(e) => {
                                                                    const newDropdownItems = [...item.dropdownItems];
                                                                    newDropdownItems[dropIndex] = { ...dropItem, label: e.target.value };
                                                                    handleArrayItemChange(path, index, 'dropdownItems', newDropdownItems);
                                                                }}
                                                                className={`w-full px-2 py-1 border rounded text-sm ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                                                                placeholder="Label"
                                                            />
                                                            <input
                                                                type="text"
                                                                value={dropItem.link || ''}
                                                                onChange={(e) => {
                                                                    const newDropdownItems = [...item.dropdownItems];
                                                                    newDropdownItems[dropIndex] = { ...dropItem, link: e.target.value };
                                                                    handleArrayItemChange(path, index, 'dropdownItems', newDropdownItems);
                                                                }}
                                                                className={`w-full px-2 py-1 border rounded text-sm ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                                                                placeholder="/link"
                                                            />
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                );
            }

            // Default array handling for other sections
            return (
                <div key={path} className="mb-6">
                    <div className="flex justify-between items-center mb-3">
                        <h4 className={`text-md font-semibold ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                            {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())} ({value.length} items)
                        </h4>
                        <button
                            onClick={() => addArrayItem(path)}
                            className="bg-green-600 text-white px-3 py-1 rounded-md hover:bg-green-700 text-sm flex items-center gap-1"
                        >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                            </svg>
                            Add New Item
                        </button>
                    </div>
                    <div className="space-y-2">
                        {value.map((item, index) => {
                            // Create a preview text for the accordion summary
                            let previewText = `Item ${index + 1}`;
                            if (typeof item === 'object' && item !== null) {
                                if (item.title) previewText = item.title;
                                else if (item.question) previewText = item.question.substring(0, 50) + (item.question.length > 50 ? '...' : '');
                                else if (item.name) previewText = item.name;
                                else if (item.label) previewText = item.label;
                                else if (Object.keys(item).length > 0) {
                                    const firstKey = Object.keys(item)[0];
                                    const firstValue = item[firstKey];
                                    if (typeof firstValue === 'string' && firstValue.length > 0) {
                                        previewText = `${firstKey}: ${firstValue.substring(0, 30)}${firstValue.length > 30 ? '...' : ''}`;
                                    }
                                }
                            } else if (typeof item === 'string' && item.length > 0) {
                                previewText = item.substring(0, 50) + (item.length > 50 ? '...' : '');
                            }

                            return (
                                <details key={`${path}.${index}`} className={`border rounded-lg ${theme === 'dark' ? 'border-gray-600 bg-gray-800' : 'border-gray-300 bg-gray-50'}`}>
                                    <summary className={`cursor-pointer p-3 font-medium ${theme === 'dark' ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'} flex justify-between items-center`}>
                                        <span className="truncate pr-4">{previewText}</span>
                                        <button
                                            onClick={(e) => {
                                                e.preventDefault();
                                                if (confirm('Are you sure you want to delete this item?')) {
                                                    removeArrayItem(path, index);
                                                }
                                            }}
                                            className="text-red-600 hover:text-red-800 ml-2 shrink-0"
                                        >
                                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                    </summary>
                                    <div className="p-3 border-t border-gray-200 dark:border-gray-600">
                                        {typeof item === 'object' && item !== null ? (
                                            <div className="space-y-2">
                                                {Object.entries(item).map(([itemKey, itemValue]) =>
                                                    renderField(itemKey, itemValue, `${path}.${index}.${itemKey}`)
                                                )}
                                            </div>
                                        ) : (
                                            <input
                                                type="text"
                                                value={item}
                                                onChange={(e) => handleArrayItemChange(path, index, '', e.target.value)}
                                                className={`w-full px-3 py-2 border rounded-md ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                                            />
                                        )}
                                    </div>
                                </details>
                            );
                        })}
                    </div>
                </div>
            );
        }

        if (typeof value === 'string') {
            return (
                <div key={path} className="mb-4">
                    <label className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                        {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    </label>
                    <input
                        type="text"
                        value={value}
                        onChange={(e) => handleInputChange(path, e.target.value)}
                        className={`w-full px-3 py-2 border rounded-md ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                    />
                </div>
            );
        } else if (typeof value === 'boolean') {
            return (
                <div key={path} className="mb-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={value}
                            onChange={(e) => handleInputChange(path, e.target.checked)}
                            className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <span className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                            {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                        </span>
                    </label>
                </div>
            );
        } else if (typeof value === 'object' && value !== null) {
            return (
                <div key={path} className="mb-4">
                    <h4 className={`text-md font-semibold mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                        {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    </h4>
                    <div className="ml-4 space-y-2">
                        {Object.entries(value).map(([subKey, subValue]) =>
                            renderField(subKey, subValue, `${path}.${subKey}`)
                        )}
                    </div>
                </div>
            );
        }
        return null;
    };

    if (!token) {
        return <div>Loading...</div>;
    }

    if (!currentSection) {
        return <div>Section not found</div>;
    }

    if (loading) {
        return (
            <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
                <div className="flex items-center justify-center min-h-screen">
                    <div className="text-lg">Loading...</div>
                </div>
            </div>
        );
    }

    return (
        <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
            {/* Download Modal */}
            {showDownloadModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className={`max-w-md w-full rounded-xl shadow-2xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
                        <div className="p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <div className={`p-3 rounded-full ${theme === 'dark' ? 'bg-indigo-900/50' : 'bg-indigo-100'}`}>
                                    <svg className="w-6 h-6 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold">Download Options</h3>
                                    <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                        Choose how to export your data
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-3 mb-6">
                                <button
                                    onClick={() => executeDownload(true)}
                                    className={`w-full p-4 rounded-lg border-2 transition-all duration-200 text-left ${theme === 'dark'
                                        ? 'bg-linear-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 border-indigo-500 text-white shadow-lg hover:shadow-xl'
                                        : 'bg-linear-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 border-indigo-400 text-white shadow-md hover:shadow-lg'
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-white/20 rounded-lg">
                                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <div>
                                            <div className="font-semibold">With Images</div>
                                            <div className="text-sm opacity-90">Download as ZIP with all images included</div>
                                        </div>
                                    </div>
                                </button>

                                <button
                                    onClick={() => executeDownload(false)}
                                    className={`w-full p-4 rounded-lg border-2 transition-all duration-200 text-left ${theme === 'dark'
                                        ? 'bg-gray-700 hover:bg-gray-600 border-gray-600 text-white'
                                        : 'bg-gray-100 hover:bg-gray-200 border-gray-300 text-gray-900'
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-lg ${theme === 'dark' ? 'bg-gray-600' : 'bg-gray-200'}`}>
                                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <div>
                                            <div className="font-semibold">Data Only</div>
                                            <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                                Download {selectedFormat?.toUpperCase()} file without images
                                            </div>
                                        </div>
                                    </div>
                                </button>
                            </div>

                            <button
                                onClick={() => setShowDownloadModal(false)}
                                className={`w-full px-4 py-2 rounded-lg border transition-colors ${theme === 'dark'
                                    ? 'border-gray-600 hover:bg-gray-700 text-gray-300'
                                    : 'border-gray-300 hover:bg-gray-50 text-gray-700'
                                    }`}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Header */}
            <header className={`shadow-sm ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-4">
                        <div className="flex items-center gap-4">
                            <Link href="/dashboard" className="text-indigo-600 hover:text-indigo-800">
                                ← Back to Dashboard
                            </Link>
                            <h1 className="text-2xl font-bold">Edit {currentSection.name}</h1>
                        </div>
                        <div className="flex items-center gap-4">
                            <span>Welcome, {user?.name}</span>
                            <button
                                onClick={() => setShowLogoutModal(true)}
                                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Edit Form */}
                    <div>
                        {isEditing ? (
                            <div className={`p-6 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
                                <h3 className={`text-lg font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                    Edit {currentSection.name}
                                </h3>
                                <div className="space-y-4">
                                    {Object.entries(sectionData).map(([key, value]) => renderField(key, value))}
                                </div>
                                <div className="mt-6 flex gap-2">
                                    <button
                                        onClick={() => setShowSaveModal(true)}
                                        className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
                                    >
                                        Save Changes
                                    </button>
                                    <button
                                        onClick={() => setIsEditing(false)}
                                        className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className={`p-6 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-lg font-semibold flex items-center gap-2">
                                        <svg className="w-5 h-5 text-indigo-500" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        {currentSection.name} Section
                                    </h3>
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors flex items-center gap-2"
                                    >
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                        </svg>
                                        Edit
                                    </button>
                                </div>
                                <div className={`border rounded-lg p-4 ${theme === 'dark' ? 'border-gray-700 bg-gray-900' : 'border-gray-200 bg-gray-50'}`}>
                                    <pre className={`text-sm overflow-auto max-h-96 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                                        {JSON.stringify(sectionData, null, 2)}
                                    </pre>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Section Info */}
                    <div className={`p-6 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
                        <h3 className="text-lg font-semibold mb-4">Section Information</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Section Name
                                </label>
                                <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                                    {currentSection.name}
                                </p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    File
                                </label>
                                <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                                    {currentSection.file}
                                </p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Description
                                </label>
                                <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                                    {currentSection.description}
                                </p>
                            </div>

                            {/* Download Section */}
                            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                                <div className="flex items-center gap-2 mb-3">
                                    <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                                        Export Section Data
                                    </label>
                                </div>
                                <div className="space-y-2">
                                    <button
                                        onClick={() => handleDownload('csv')}
                                        className="group w-full flex items-center cursor-pointer justify-between px-4 py-3 rounded-lg border-2 border-[#f7ae31] text-white shadow-md hover:shadow-lg transition-all duration-200"
                                        style={{ background: 'linear-gradient(to left, #f7ae31, #fb6220)' }}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-white/20 rounded-lg group-hover:bg-white/30 transition-colors">
                                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                                                </svg>
                                            </div>
                                            <div className="text-left">
                                                <div className="font-semibold text-sm">CSV Format</div>
                                                <div className="text-xs opacity-90">Spreadsheet compatible</div>
                                            </div>
                                        </div>
                                        <svg className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </button>

                                    <button
                                        onClick={() => handleDownload('excel')}
                                        className="group w-full flex items-center cursor-pointer justify-between px-4 py-3 rounded-lg border-2 border-[#a0db5e] text-white shadow-md hover:shadow-lg transition-all duration-200"
                                        style={{ background: 'linear-gradient(to left, #a0db5e, #68b63a)' }}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-white/20 rounded-lg group-hover:bg-white/30 transition-colors">
                                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                                                </svg>
                                            </div>
                                            <div className="text-left">
                                                <div className="font-semibold text-sm">Excel Format</div>
                                                <div className="text-xs opacity-90">XLSX workbook</div>
                                            </div>
                                        </div>
                                        <svg className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </button>

                                    <button
                                        onClick={() => handleDownload('json')}
                                        className="group w-full flex items-center cursor-pointer justify-between px-4 py-3 rounded-lg border-2 border-[#69a6fb] text-white shadow-md hover:shadow-lg transition-all duration-200"
                                        style={{ background: 'linear-gradient(to left, #69a6fb, #1e5ae4)' }}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-white/20 rounded-lg group-hover:bg-white/30 transition-colors">
                                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                                                </svg>
                                            </div>
                                            <div className="text-left">
                                                <div className="font-semibold text-sm">JSON Format</div>
                                                <div className="text-xs opacity-90">Raw structured data</div>
                                            </div>
                                        </div>
                                        <svg className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </button>
                                </div>
                                <p className="mt-3 text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                    </svg>
                                    All formats include associated images in a ZIP archive
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Navigation Links */}
                <div className="mt-8 flex gap-4">
                    <Link href="/" className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10.707 2.293a1 1 0 00-1.414 0l-9 9a1 1 0 001.414 1.414L2 12.414V19a1 1 0 001 1h3a1 1 0 001-1v-3a1 1 0 011-1h2a1 1 0 011 1v3a1 1 0 001 1h3a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-9-9z" />
                        </svg>
                        View Home Page
                    </Link>
                </div>
            </div>

            {/* Logout Confirmation Modal */}
            {showLogoutModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div
                        className="absolute inset-0"
                        onClick={() => setShowLogoutModal(false)}
                    />
                    <div className={`relative z-10 p-6 rounded-lg shadow-xl max-w-md w-full mx-4 ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-full">
                                <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold">Confirm Logout</h3>
                        </div>
                        <p className={`mb-6 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                            Are you sure you want to logout?
                        </p>
                        <div className="flex gap-3 justify-end">
                            <button
                                onClick={() => setShowLogoutModal(false)}
                                className={`px-4 py-2 rounded-md transition-colors ${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-800'}`}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={logout}
                                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Save Changes Confirmation Modal */}
            {showSaveModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
                    <div className={`relative z-10 p-6 rounded-lg shadow-xl max-w-md w-full mx-4 ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-full">
                                <svg className="w-6 h-6 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold">Save Changes</h3>
                        </div>
                        <p className={`mb-6 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                            Are you sure you want to save these changes? This will update the section data.
                        </p>
                        <div className="flex gap-3 justify-end">
                            <button
                                onClick={() => setShowSaveModal(false)}
                                className={`px-4 py-2 rounded-md transition-colors ${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-800'}`}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={saveSectionData}
                                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Image Upload Confirmation Modal */}
            {showUploadModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
                    <div className={`relative z-10 p-6 rounded-lg shadow-xl max-w-md w-full mx-4 ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-full">
                                <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold">Upload Image</h3>
                        </div>
                        <p className={`mb-6 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                            {pendingUpload?.path.includes('favicon')
                                ? 'Are you sure you want to upload this favicon? The old favicon will be deleted.'
                                : 'Are you sure you want to upload this image? The old image will be deleted if it exists.'
                            }
                        </p>
                        <div className="flex gap-3 justify-end">
                            <button
                                onClick={() => {
                                    setShowUploadModal(false);
                                    setPendingUpload(null);
                                }}
                                className={`px-4 py-2 rounded-md transition-colors ${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-800'}`}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmImageUpload}
                                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                            >
                                Upload
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}