import React, { useState, useEffect } from 'react';
import { 
  Sparkles, Video, Play, FileText, Send, 
  Loader2, CheckCircle2, Film, Settings2, 
  Wand2, Layers, ArrowRight, Download, Share2,
  Plus, Trash2, Image as ImageIcon, Type, X,
  Save, FolderOpen, ChevronDown
} from 'lucide-react';

interface CustomField {
  id: string;
  type: 'text' | 'image';
  label: string;
  value: string;
}

interface SavedTemplate {
  id: string;
  name: string;
  fields: CustomField[];
}

const TEMPLATES = [
  { id: 't1', name: '新车上市宣传', fields: [] },
  { id: 't2', name: '节日促销活动', fields: [] },
  { id: 't3', name: '门店探店 Vlog', fields: [] },
  { id: 't4', name: '车主口碑访谈', fields: [] },
];

const AIMarketing: React.FC = () => {
  const [formData, setFormData] = useState({
    topic: '',
    keywords: '',
    style: 'cinematic',
    duration: '15s',
    ratio: '9:16',
    template: 't1'
  });

  const [customFields, setCustomFields] = useState<CustomField[]>([]);
  const [savedTemplates, setSavedTemplates] = useState<SavedTemplate[]>([]);
  const [isAddingField, setIsAddingField] = useState(false);
  const [newField, setNewField] = useState<{label: string; type: 'text' | 'image'}>({ label: '', type: 'text' });
  const [templateName, setTemplateName] = useState('');
  const [isSavingTemplate, setIsSavingTemplate] = useState(false);

  // Load saved templates from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('ai_marketing_templates');
    if (saved) {
      setSavedTemplates(JSON.parse(saved));
    }
  }, []);

  const saveCurrentTemplate = () => {
    if (!templateName) return;
    
    const newTemplate: SavedTemplate = {
      id: Date.now().toString(),
      name: templateName,
      fields: customFields
    };
    
    const updatedTemplates = [...savedTemplates, newTemplate];
    setSavedTemplates(updatedTemplates);
    localStorage.setItem('ai_marketing_templates', JSON.stringify(updatedTemplates));
    setIsSavingTemplate(false);
    setTemplateName('');
  };

  const loadTemplate = (template: SavedTemplate) => {
    setCustomFields(template.fields);
  };

  const deleteTemplate = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const updated = savedTemplates.filter(t => t.id !== id);
    setSavedTemplates(updated);
    localStorage.setItem('ai_marketing_templates', JSON.stringify(updated));
  };

  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState(0);
  const [generatedResult, setGeneratedResult] = useState<{
    script: string;
    videoUrl: string | null;
  } | null>(null);

  const steps = [
    { title: '解析需求', desc: '正在分析您的营销主题与关键词...' },
    { title: '构建工作流', desc: '调用营销专家Agent生成分镜头脚本...' },
    { title: 'AI 绘图/生成', desc: 'Stable Diffusion 正在生成关键帧...' },
    { title: '视频合成', desc: '正在渲染最终视频效果...' }
  ];

  const handleGenerate = () => {
    // Removed validation for topic
    
    setIsGenerating(true);
    setGenerationStep(0);
    setGeneratedResult(null);

    // Simulate workflow process
    let step = 0;
    const interval = setInterval(() => {
      step++;
      setGenerationStep(step);
      
      if (step >= steps.length) {
        clearInterval(interval);
        setIsGenerating(false);
        setGeneratedResult({
          script: `【开场】(0-3s)\n画面：一辆极具未来感的银色轿车在赛博朋克风格的城市街道飞驰，霓虹灯光在车身流转。\n旁白：打破界限，重塑未来。\n\n【中段】(3-10s)\n画面：快速剪辑车内智能座舱细节，手指轻触大屏，全景天窗打开。\n旁白：不仅仅是座驾，更是你的移动智能空间。\n\n【结尾】(10-15s)\n画面：车辆停在海边悬崖，日出金光洒满车身，Logo特写。\n旁白：全新 ${formData.topic || '智能轿跑'}，此刻即未来。`,
          videoUrl: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&q=80&w=1000' // Placeholder image as "video"
        });
      }
    }, 1500);
  };

  const addCustomField = () => {
    if (!newField.label) return;
    setCustomFields([
      ...customFields, 
      { 
        id: Date.now().toString(), 
        label: newField.label, 
        type: newField.type, 
        value: '' 
      }
    ]);
    setIsAddingField(false);
    setNewField({ label: '', type: 'text' });
  };

  const removeCustomField = (id: string) => {
    setCustomFields(customFields.filter(f => f.id !== id));
  };

  const updateCustomFieldValue = (id: string, value: string) => {
    setCustomFields(customFields.map(f => f.id === id ? { ...f, value } : f));
  };

  return (
    <div className="space-y-6 h-[calc(100vh-100px)] flex flex-col">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Sparkles className="text-purple-600" />
            AI 视频营销生成
          </h2>
          <p className="text-slate-500 text-sm mt-1">输入营销创意，AI 自动生成分镜头脚本并合成视频</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 min-h-0">
        {/* Left Panel: Configuration */}
        <div className="lg:col-span-4 bg-white rounded-xl border border-slate-200 p-6 flex flex-col h-full overflow-y-auto shadow-sm">
          <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
            <Settings2 size={18} />
            参数配置
          </h3>
          
          <div className="space-y-5 flex-1">
            {/* Template Selection */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">生成模板类型</label>
              <select 
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
                value={formData.template}
                onChange={(e) => setFormData({...formData, template: e.target.value})}
              >
                {TEMPLATES.map(t => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">视频风格</label>
                <select 
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
                  value={formData.style}
                  onChange={(e) => setFormData({...formData, style: e.target.value})}
                >
                  <option value="cinematic">电影质感</option>
                  <option value="tech">科技未来</option>
                  <option value="vlog">生活 Vlog</option>
                  <option value="promo">硬广促销</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">时长</label>
                <select 
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
                  value={formData.duration}
                  onChange={(e) => setFormData({...formData, duration: e.target.value})}
                >
                  <option value="15s">15秒 (短视频)</option>
                  <option value="30s">30秒 (推荐)</option>
                  <option value="60s">60秒 (长视频)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">画幅比例</label>
              <div className="flex gap-3">
                <button 
                  onClick={() => setFormData({...formData, ratio: '9:16'})}
                  className={`flex-1 py-2 border rounded-lg flex items-center justify-center gap-2 text-sm transition-all ${
                    formData.ratio === '9:16' 
                      ? 'border-purple-600 bg-purple-50 text-purple-700 font-medium' 
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <div className="w-2 h-3.5 border-2 border-current rounded-[1px]"></div>
                  9:16 (抖音)
                </button>
                <button 
                  onClick={() => setFormData({...formData, ratio: '16:9'})}
                  className={`flex-1 py-2 border rounded-lg flex items-center justify-center gap-2 text-sm transition-all ${
                    formData.ratio === '16:9' 
                      ? 'border-purple-600 bg-purple-50 text-purple-700 font-medium' 
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <div className="w-3.5 h-2 border-2 border-current rounded-[1px]"></div>
                  16:9 (横屏)
                </button>
              </div>
            </div>

            {/* Custom Fields Section */}
            <div className="pt-4 border-t border-slate-100">
              <label className="block text-sm font-medium text-slate-700 mb-3 flex items-center justify-between">
                <span>自定义素材/参数</span>
                <div className="flex gap-2">
                  <div className="relative group/templates">
                    <button className="text-xs text-slate-500 hover:text-purple-600 flex items-center gap-1 bg-slate-50 px-2 py-1 rounded border border-slate-200">
                      <FolderOpen size={12} />
                      加载配置
                      <ChevronDown size={10} />
                    </button>
                    {/* Saved Templates Dropdown */}
                    <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-slate-200 rounded-lg shadow-lg z-10 hidden group-hover/templates:block">
                      {savedTemplates.length === 0 ? (
                        <div className="p-3 text-xs text-slate-400 text-center">暂无保存的配置</div>
                      ) : (
                        <div className="py-1">
                          {savedTemplates.map(template => (
                            <div 
                              key={template.id}
                              onClick={() => loadTemplate(template)}
                              className="px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 cursor-pointer flex justify-between items-center group/item"
                            >
                              <span>{template.name}</span>
                              <Trash2 
                                size={12} 
                                className="text-slate-300 hover:text-red-500 opacity-0 group-hover/item:opacity-100 transition-opacity"
                                onClick={(e) => deleteTemplate(e, template.id)}
                              />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => setIsSavingTemplate(true)}
                    className="text-xs text-slate-500 hover:text-purple-600 flex items-center gap-1 bg-slate-50 px-2 py-1 rounded border border-slate-200"
                  >
                    <Save size={12} />
                    保存配置
                  </button>
                </div>
              </label>

              {isSavingTemplate && (
                <div className="mb-3 bg-purple-50 p-3 rounded-lg border border-purple-100 animate-in fade-in zoom-in-95 duration-200">
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      className="flex-1 px-2 py-1.5 text-xs border border-purple-200 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="为当前配置命名..."
                      autoFocus
                      value={templateName}
                      onChange={(e) => setTemplateName(e.target.value)}
                    />
                    <button 
                      onClick={() => setIsSavingTemplate(false)}
                      className="px-2 py-1 text-xs text-slate-500 hover:bg-white rounded"
                    >
                      取消
                    </button>
                    <button 
                      onClick={saveCurrentTemplate}
                      disabled={!templateName}
                      className="px-2 py-1 text-xs text-white bg-purple-600 hover:bg-purple-700 rounded disabled:bg-purple-300"
                    >
                      保存
                    </button>
                  </div>
                </div>
              )}

              <div className="space-y-3">
                {customFields.map((field) => (
                  <div key={field.id} className="group relative">
                    <label className="block text-xs font-medium text-slate-500 mb-1 flex items-center gap-1">
                      {field.type === 'text' ? <Type size={12} /> : <ImageIcon size={12} />}
                      {field.label}
                    </label>
                    <div className="flex gap-2">
                      {field.type === 'text' ? (
                        <input 
                          type="text" 
                          className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                          placeholder={`请输入${field.label}`}
                          value={field.value}
                          onChange={(e) => updateCustomFieldValue(field.id, e.target.value)}
                        />
                      ) : (
                        <div className="flex-1 border-2 border-dashed border-slate-200 rounded-lg p-3 flex items-center justify-center gap-2 cursor-pointer hover:bg-slate-50 transition-colors relative group/upload">
                          {field.value ? (
                             <div className="relative w-full h-20 bg-slate-100 rounded overflow-hidden flex items-center justify-center">
                                <span className="text-xs text-slate-500 truncate px-2">{field.value}</span>
                                <button 
                                  onClick={() => updateCustomFieldValue(field.id, '')}
                                  className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-0.5 hover:bg-black/70"
                                >
                                  <X size={12} />
                                </button>
                             </div>
                          ) : (
                            <div 
                              className="text-slate-400 flex flex-col items-center gap-1 py-2"
                              onClick={() => updateCustomFieldValue(field.id, 'uploaded_image_mock.jpg')}
                            >
                              <ImageIcon size={20} />
                              <span className="text-xs">点击上传图片</span>
                            </div>
                          )}
                        </div>
                      )}
                      <button 
                        onClick={() => removeCustomField(field.id)}
                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors self-start mt-0.5"
                        title="删除字段"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}

                {isAddingField ? (
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
                    <div className="flex gap-2 mb-2">
                      <input 
                        type="text" 
                        className="flex-1 px-2 py-1.5 text-sm border border-slate-200 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="字段名称 (如: 品牌Logo)"
                        autoFocus
                        value={newField.label}
                        onChange={(e) => setNewField({...newField, label: e.target.value})}
                      />
                      <select 
                        className="px-2 py-1.5 text-sm border border-slate-200 rounded focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
                        value={newField.type}
                        onChange={(e) => setNewField({...newField, type: e.target.value as 'text' | 'image'})}
                      >
                        <option value="text">文案</option>
                        <option value="image">图片</option>
                      </select>
                    </div>
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => setIsAddingField(false)}
                        className="px-3 py-1 text-xs text-slate-500 hover:bg-slate-200 rounded"
                      >
                        取消
                      </button>
                      <button 
                        onClick={addCustomField}
                        disabled={!newField.label}
                        className={`px-3 py-1 text-xs text-white rounded ${!newField.label ? 'bg-purple-300' : 'bg-purple-600 hover:bg-purple-700'}`}
                      >
                        确认添加
                      </button>
                    </div>
                  </div>
                ) : (
                  <button 
                    onClick={() => setIsAddingField(true)}
                    className="w-full py-2 border border-dashed border-slate-300 rounded-lg text-slate-500 text-sm flex items-center justify-center gap-1 hover:border-purple-500 hover:text-purple-600 hover:bg-purple-50 transition-all"
                  >
                    <Plus size={16} />
                    添加自定义参数
                  </button>
                )}
              </div>
            </div>
          </div>

          <button 
            onClick={handleGenerate}
            disabled={isGenerating}
            className={`w-full py-3 rounded-xl text-white font-bold text-lg shadow-md flex items-center justify-center gap-2 transition-all mt-6 ${
              isGenerating
                ? 'bg-slate-300 cursor-not-allowed' 
                : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 hover:shadow-lg transform hover:-translate-y-0.5'
            }`}
          >
            {isGenerating ? (
              <>
                <Loader2 className="animate-spin" />
                生成中...
              </>
            ) : (
              <>
                <Wand2 />
                立即生成
              </>
            )}
          </button>
        </div>

        {/* Right Panel: Workflow & Preview */}
        <div className="lg:col-span-8 flex flex-col gap-6 h-full">
          {/* Result Preview Area */}
          <div className="flex-1 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200 flex items-center justify-center relative overflow-hidden group">
            {!generatedResult && !isGenerating && (
              <div className="text-center text-slate-400">
                <div className="w-20 h-20 bg-slate-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Video size={40} className="text-slate-400" />
                </div>
                <p className="text-lg font-medium">暂无生成内容</p>
                <p className="text-sm mt-1">请在左侧配置参数并开始生成</p>
              </div>
            )}

            {isGenerating && (
              <div className="text-center">
                <div className="w-20 h-20 relative mx-auto mb-6">
                  <div className="absolute inset-0 rounded-full border-4 border-slate-200"></div>
                  <div className="absolute inset-0 rounded-full border-4 border-purple-500 border-t-transparent animate-spin"></div>
                  <Sparkles className="absolute inset-0 m-auto text-purple-500 animate-pulse" size={24} />
                </div>
                <h3 className="text-xl font-bold text-slate-700 animate-pulse">
                  {steps[Math.min(generationStep, steps.length - 1)]?.title || '处理中...'}
                </h3>
                <p className="text-slate-500 mt-2">
                  {steps[Math.min(generationStep, steps.length - 1)]?.desc}
                </p>
              </div>
            )}

            {generatedResult && (
              <div className="w-full h-full flex flex-col md:flex-row">
                {/* Script Panel */}
                <div className="flex-1 p-6 overflow-y-auto border-r border-slate-200 bg-white">
                  <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <FileText size={18} className="text-blue-500" />
                    AI 生成脚本
                  </h4>
                  <div className="prose prose-slate prose-sm max-w-none whitespace-pre-wrap text-slate-600 bg-slate-50 p-4 rounded-lg border border-slate-100">
                    {generatedResult.script}
                  </div>
                </div>

                {/* Video Preview Panel */}
                <div className="w-full md:w-[400px] bg-black flex flex-col items-center justify-center relative">
                  <div className="relative w-full h-full flex items-center justify-center">
                    <img 
                      src={generatedResult.videoUrl!} 
                      alt="Generated Video Preview" 
                      className="max-w-full max-h-full object-contain opacity-80"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center cursor-pointer hover:scale-110 transition-transform">
                        <Play size={32} className="text-white fill-white ml-1" />
                      </div>
                    </div>
                    <div className="absolute bottom-4 right-4 bg-black/60 text-white text-xs px-2 py-1 rounded">
                      预览模式
                    </div>
                  </div>
                  
                  {/* Action Bar */}
                  <div className="w-full bg-slate-900 p-4 flex justify-between items-center border-t border-slate-800">
                    <div className="flex gap-2">
                      <button className="p-2 rounded-lg bg-slate-800 text-white hover:bg-slate-700 transition-colors" title="下载">
                        <Download size={18} />
                      </button>
                      <button className="p-2 rounded-lg bg-slate-800 text-white hover:bg-slate-700 transition-colors" title="分享">
                        <Share2 size={18} />
                      </button>
                    </div>
                    <button className="bg-purple-600 text-white px-6 py-2 rounded-lg font-bold text-sm hover:bg-purple-700 transition-all flex items-center gap-2">
                      <Film size={16} />
                      发布到抖音
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIMarketing;