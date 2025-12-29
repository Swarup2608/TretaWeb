'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { useMeta } from '@/context/MetaContext';
import Link from 'next/link';

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
                    alert('Data saved successfully!');
                    setIsEditing(false);
                    // Reload the section data to reflect changes
                    loadSectionData();
                    // If meta was updated, update the context
                    if (currentSection.file === 'meta.json') {
                        updateMeta(sectionData);
                    }
                } else {
                    alert('Failed to save data: ' + result.error);
                }
            } catch (error) {
                console.error('Error saving data:', error);
                alert('Failed to save data');
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
        const formData = new FormData();
        formData.append('file', file);
        formData.append('sectionName', currentSection!.name.toLowerCase().replace(' ', '-'));

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
                alert('Image uploaded successfully!');
            } else {
                alert('Upload failed: ' + result.error);
            }
        } catch (error) {
            console.error('Upload error:', error);
            alert('Upload failed');
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

    const renderField = (key: string, value: any, path: string = key) => {
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
        if (typeof value === 'string' && (value.startsWith('/images/') || key.toLowerCase().includes('image') || key.toLowerCase().includes('background'))) {
            return (
                <div key={path} className="mb-4">
                    <label className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                        {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    </label>
                    {value && (
                        <div className="mb-2">
                            <img
                                src={value}
                                alt="Current"
                                className="max-w-full h-32 object-cover rounded border"
                            />
                        </div>
                    )}
                    <div className="flex gap-2">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                    handleImageUpload(file, path);
                                }
                            }}
                            className={`flex-1 px-3 py-2 border rounded-md ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                        />
                        <input
                            type="text"
                            value={value}
                            onChange={(e) => handleInputChange(path, e.target.value)}
                            placeholder="Or enter image URL"
                            className={`flex-1 px-3 py-2 border rounded-md ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                        />
                    </div>
                </div>
            );
        }

        if (Array.isArray(value)) {
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
                                            className="text-red-600 hover:text-red-800 ml-2 flex-shrink-0"
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
                                onClick={logout}
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
                                        onClick={saveSectionData}
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
        </div>
    );
}