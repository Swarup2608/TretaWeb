'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

interface MetaData {
    seo: {
        title: string;
        description: string;
        keywords: string;
        themeColor: string;
        favicon?: string;
    };
    colors: {
        primaryLight: string;
        primaryDark: string;
        secondaryLight: string;
        secondaryDark: string;
    };
    fonts: {
        fontFamily: string;
    };
}

interface MetaContextType {
    meta: MetaData;
    updateMeta: (newMeta: MetaData) => void;
}

const MetaContext = createContext<MetaContextType | undefined>(undefined);

export function MetaProvider({ children }: { children: ReactNode }) {
    const [meta, setMeta] = useState<MetaData>({
        seo: {
            title: "Treta - Business Consulting",
            description: "Expert strategic consulting to drive sustainable growth, operational innovation, and lasting business transformation across industries and markets.",
            keywords: "business consulting, strategy, growth, innovation, transformation",
            themeColor: "#3B82F6"
        },
        colors: {
            primaryLight: "#3B82F6",
            primaryDark: "#60A5FA",
            secondaryLight: "#10B981",
            secondaryDark: "#34D399"
        },
        fonts: {
            fontFamily: "Geist"
        }
    });

    useEffect(() => {
        // Load meta from file
        const loadMeta = async () => {
            try {
                const res = await fetch('/SiteContent/meta.json');
                const data = await res.json();
                setMeta(data);
                applyMeta(data);
            } catch (error) {
                console.error('Error loading meta:', error);
            }
        };
        loadMeta();

        // Listen for theme changes
        const observer = new MutationObserver(() => {
            applyMeta(meta);
        });

        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['class']
        });

        return () => observer.disconnect();
    }, [meta]);

    const applyMeta = (metaData: MetaData) => {
        // Apply CSS variables for colors
        const root = document.documentElement;
        const isDark = root.classList.contains('dark');

        root.style.setProperty('--primary-light', metaData.colors.primaryLight);
        root.style.setProperty('--primary-dark', metaData.colors.primaryDark);
        root.style.setProperty('--secondary-light', metaData.colors.secondaryLight);
        root.style.setProperty('--secondary-dark', metaData.colors.secondaryDark);

        // Set current primary and secondary based on theme
        root.style.setProperty('--primary', isDark ? metaData.colors.primaryDark : metaData.colors.primaryLight);
        root.style.setProperty('--secondary', isDark ? metaData.colors.secondaryDark : metaData.colors.secondaryLight);

        // Apply font
        root.style.setProperty('--font-family', metaData.fonts.fontFamily);

        // Update theme color meta tag
        let themeColorMeta = document.querySelector('meta[name="theme-color"]');
        if (!themeColorMeta) {
            themeColorMeta = document.createElement('meta');
            themeColorMeta.setAttribute('name', 'theme-color');
            document.head.appendChild(themeColorMeta);
        }
        themeColorMeta.setAttribute('content', metaData.seo.themeColor);

        // Update document title and meta description
        document.title = metaData.seo.title;
        let descriptionMeta = document.querySelector('meta[name="description"]');
        if (!descriptionMeta) {
            descriptionMeta = document.createElement('meta');
            descriptionMeta.setAttribute('name', 'description');
            document.head.appendChild(descriptionMeta);
        }
        descriptionMeta.setAttribute('content', metaData.seo.description);

        // Update keywords
        let keywordsMeta = document.querySelector('meta[name="keywords"]');
        if (!keywordsMeta) {
            keywordsMeta = document.createElement('meta');
            keywordsMeta.setAttribute('name', 'keywords');
            document.head.appendChild(keywordsMeta);
        }
        keywordsMeta.setAttribute('content', metaData.seo.keywords);
    };

    const updateMeta = (newMeta: MetaData) => {
        setMeta(newMeta);
        applyMeta(newMeta);
    };

    return (
        <MetaContext.Provider value={{ meta, updateMeta }}>
            {children}
        </MetaContext.Provider>
    );
}

export function useMeta() {
    const context = useContext(MetaContext);
    if (context === undefined) {
        throw new Error('useMeta must be used within a MetaProvider');
    }
    return context;
}