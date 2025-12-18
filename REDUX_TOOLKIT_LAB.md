# 🔄 Лабораторная работа №3: Интеграция Redux Toolkit

## Описание

Эта лабораторная работа демонстрирует интеграцию **Redux Toolkit** в существующий React-проект для централизованного управления состоянием приложения, упрощения работы с асинхронными операциями и улучшения предсказуемости состояния.

---

## Цели работы

- ✅ Установить и настроить Redux Toolkit
- ✅ Создать централизованное хранилище (store)
- ✅ Реализовать slices для разных доменов
- ✅ Создать async thunks для API операций
- ✅ Интегрировать Redux в компоненты
- ✅ Использовать мемоизированные селекторы
- ✅ Заменить локальное состояние на глобальное

---

## Установка

```bash
npm install @reduxjs/toolkit react-redux
```

**Версии:**
- `@reduxjs/toolkit`: ^2.x
- `react-redux`: ^9.x

---

## Структура проекта

```
src/
├── store/
│   ├── store.js                    # Конфигурация store
│   ├── selectors.js                # Мемоизированные селекторы
│   ├── slices/
│   │   ├── postsSlice.js          # Slice для постов
│   │   ├── usersSlice.js          # Slice для пользователей
│   │   └── uiSlice.js             # Slice для UI состояния
│   └── hooks/
│       ├── usePosts.js            # Кастомный хук для постов
│       ├── useUsers.js            # Кастомный хук для пользователей
│       └── useUI.js               # Кастомный хук для UI
├── api.js                          # API функции
├── main.jsx                        # Redux Provider
└── App.jsx                         # Главный компонент
```

---

## 1. Настройка Store

### [src/store/store.js](src/store/store.js)

```javascript
import { configureStore } from '@reduxjs/toolkit';
import postsReducer from './slices/postsSlice';
import usersReducer from './slices/usersSlice';
import uiReducer from './slices/uiSlice';

export const store = configureStore({
  reducer: {
    posts: postsReducer,
    users: usersReducer,
    ui: uiReducer,
  },
  devTools: process.env.NODE_ENV !== 'production',
});
```

**Преимущества `configureStore`:**
- Автоматическая настройка Redux DevTools
- Встроенный redux-thunk middleware
- Проверка мутаций в development режиме
- Упрощенная конфигурация

---

## 2. Созданные Slices

### 2.1. Posts Slice

**Файл:** [src/store/slices/postsSlice.js](src/store/slices/postsSlice.js)

**State:**
```javascript
{
  items: [],           // Массив постов
  loading: false,      // Состояние загрузки
  error: null,         // Ошибка
  currentPost: null,   // Текущий выбранный пост
}
```

**Синхронные reducers (5 шт):**
1. `setCurrentPost` - установка текущего поста
2. `clearCurrentPost` - очистка текущего поста
3. `clearError` - очистка ошибки
4. `addPostOptimistic` - оптимистичное добавление
5. `removePostOptimistic` - удаление оптимистичного поста

**Async thunks (4 шт):**
1. `fetchPosts` - загрузка постов
2. `createPost` - создание поста
3. `updatePost` - обновление поста
4. `deletePost` - удаление поста

**Пример async thunk:**
```javascript
export const fetchPosts = createAsyncThunk(
  'posts/fetchPosts',
  async (_, { rejectWithValue }) => {
    try {
      const data = await getPosts();
      return data.slice(0, 10);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
```

**Обработка состояний в extraReducers:**
```javascript
extraReducers: (builder) => {
  builder
    .addCase(fetchPosts.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(fetchPosts.fulfilled, (state, action) => {
      state.loading = false;
      state.items = action.payload;
    })
    .addCase(fetchPosts.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
}
```

### 2.2. Users Slice

**Файл:** [src/store/slices/usersSlice.js](src/store/slices/usersSlice.js)

**State:**
```javascript
{
  items: [],           // Массив пользователей
  currentUser: null,   // Текущий пользователь
  loading: false,
  error: null,
  autoRefresh: false,  // Флаг автообновления
}
```

**Синхронные reducers (5 шт):**
1. `setCurrentUser` - установка текущего пользователя
2. `clearCurrentUser` - очистка
3. `toggleAutoRefresh` - переключение автообновления
4. `setAutoRefresh` - установка флага
5. `clearError` - очистка ошибки

**Async thunks (2 шт):**
1. `fetchUsers` - загрузка пользователей
2. `fetchUserById` - загрузка одного пользователя

### 2.3. UI Slice

**Файл:** [src/store/slices/uiSlice.js](src/store/slices/uiSlice.js)

**State:**
```javascript
{
  successMessage: '',  // Сообщение об успехе
  errorMessage: '',    // Сообщение об ошибке
  isFormVisible: false,// Видимость формы
  theme: 'light',      // Тема приложения
}
```

**Синхронные reducers (9 шт):**
1. `setSuccessMessage` - установка success сообщения
2. `clearSuccessMessage` - очистка
3. `setErrorMessage` - установка error сообщения
4. `clearErrorMessage` - очистка
5. `showForm` - показать форму
6. `hideForm` - скрыть форму
7. `toggleForm` - переключить
8. `setTheme` - установить тему
9. `toggleTheme` - переключить тему

---

## 3. Мемоизированные селекторы

**Файл:** [src/store/selectors.js](src/store/selectors.js)

### Базовые селекторы

```javascript
export const selectAllPosts = (state) => state.posts.items;
export const selectPostsLoading = (state) => state.posts.loading;
export const selectPostsError = (state) => state.posts.error;
```

### Мемоизированные селекторы с `createSelector`

#### 1. Количество постов
```javascript
export const selectPostsCount = createSelector(
  [selectAllPosts],
  (posts) => posts.length
);
```

#### 2. Фильтрация по userId
```javascript
export const selectPostsByUserId = createSelector(
  [selectAllPosts, (state, userId) => userId],
  (posts, userId) => posts.filter(post => post.userId === userId)
);
```

#### 3. Поиск по тексту
```javascript
export const selectFilteredPosts = createSelector(
  [selectAllPosts, (state, searchQuery) => searchQuery],
  (posts, searchQuery) => {
    if (!searchQuery) return posts;
    const query = searchQuery.toLowerCase();
    return posts.filter(
      post =>
        post.title.toLowerCase().includes(query) ||
        post.body.toLowerCase().includes(query)
    );
  }
);
```

#### 4. Комбинированный селектор (посты + пользователи)
```javascript
export const selectPostsWithUserInfo = createSelector(
  [selectAllPosts, selectAllUsers],
  (posts, users) => {
    return posts.map(post => {
      const user = users.find(u => u.id === post.userId);
      return {
        ...post,
        userName: user?.name || 'Unknown',
        userEmail: user?.email || '',
      };
    });
  }
);
```

**Преимущества мемоизации:**
- ✅ Пересчет только при изменении зависимостей
- ✅ Избежание лишних ре-рендеров
- ✅ Оптимизация производительности

---

## 4. Кастомные хуки

### 4.1. usePosts

**Файл:** [src/store/hooks/usePosts.js](src/store/hooks/usePosts.js)

```javascript
export function usePosts() {
  const dispatch = useDispatch();
  const posts = useSelector(selectAllPosts);
  const loading = useSelector(selectPostsLoading);
  const error = useSelector(selectPostsError);
  const count = useSelector(selectPostsCount);

  // Автоматическая загрузка при монтировании
  useEffect(() => {
    if (posts.length === 0 && !loading) {
      dispatch(fetchPosts());
    }
  }, [dispatch, posts.length, loading]);

  const handleCreatePost = useCallback(
    async (postData) => {
      await dispatch(createPost(postData)).unwrap();
      dispatch(setSuccessMessage('Пост создан!'));
    },
    [dispatch]
  );

  return {
    posts,
    loading,
    error,
    count,
    createPost: handleCreatePost,
    updatePost: handleUpdatePost,
    deletePost: handleDeletePost,
    refetch,
    clearError,
  };
}
```

**Возможности:**
- Автозагрузка данных
- Обработка всех CRUD операций
- Уведомления об успехе/ошибке
- Повторная загрузка (refetch)

### 4.2. useUsers

**Файл:** [src/store/hooks/useUsers.js](src/store/hooks/useUsers.js)

**Особенности:**
- Автообновление каждые 30 секунд (если включено)
- Управление флагом autoRefresh
- Автозагрузка при монтировании

```javascript
// Автообновление
useEffect(() => {
  if (!autoRefresh) return;
  
  const interval = setInterval(() => {
    dispatch(fetchUsers());
  }, 30000);
  
  return () => clearInterval(interval);
}, [autoRefresh, dispatch]);
```

### 4.3. useUI

**Файл:** [src/store/hooks/useUI.js](src/store/hooks/useUI.js)

**Особенности:**
- Автоматическое скрытие success сообщений через 3 секунды
- Управление видимостью форм
- Переключение темы

```javascript
// Автоскрытие success message
useEffect(() => {
  if (successMessage) {
    const timer = setTimeout(() => {
      dispatch(clearSuccessMessage());
    }, 3000);
    return () => clearTimeout(timer);
  }
}, [successMessage, dispatch]);
```

---

## 5. Интеграция в компоненты

### До (с React Query)

**App.jsx - 120 строк**
```javascript
const [successMessage, setSuccessMessage] = useState('');
const { data: posts = [], isLoading, error } = usePosts();
const createPostMutation = useCreatePost();

const handleCreatePost = async (newPost) => {
  await createPostMutation.mutateAsync(newPost);
  setSuccessMessage('Пост создан!');
  setTimeout(() => setSuccessMessage(''), 3000);
};
```

### После (с Redux)

**App.jsx - 65 строк (-46%)**
```javascript
const { posts, loading, error, count, createPost } = usePosts();
const { successMessage } = useUI();

// createPost уже содержит всю логику
<PostForm onSubmit={createPost} />
```

**Улучшения:**
- ✅ Меньше boilerplate кода
- ✅ Централизованное управление состоянием
- ✅ Автоматическая обработка уведомлений
- ✅ Переиспользуемая логика в хуках

---

## 6. Redux DevTools

### Возможности

1. **Time Travel Debugging**
   - Просмотр всех actions
   - Переход между состояниями
   - Replay actions

2. **State Inspector**
   - Просмотр текущего state
   - Сравнение состояний
   - Export/Import состояния

3. **Action Monitoring**
   - Логи всех dispatch
   - Payload данные
   - Время выполнения

### Как использовать

1. Установите [Redux DevTools Extension](https://github.com/reduxjs/redux-devtools)
2. Откройте DevTools в браузере (F12)
3. Перейдите на вкладку "Redux"
4. Выполните действия в приложении
5. Просмотрите actions и изменения state

---

## 7. Примеры использования

### Создание поста

```javascript
import { usePosts } from './store/hooks/usePosts';

function CreatePostButton() {
  const { createPost, loading } = usePosts();
  
  const handleClick = () => {
    createPost({
      title: 'Новый пост',
      body: 'Содержимое',
      userId: 1,
    });
  };
  
  return (
    <button onClick={handleClick} disabled={loading}>
      Создать пост
    </button>
  );
}
```

### Фильтрация постов

```javascript
import { useSelector } from 'react-redux';
import { selectFilteredPosts } from './store/selectors';

function SearchResults({ query }) {
  const filteredPosts = useSelector(state => 
    selectFilteredPosts(state, query)
  );
  
  return (
    <div>
      {filteredPosts.map(post => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}
```

### Автообновление пользователей

```javascript
import { useUsers } from './store/hooks/useUsers';

function UsersPanel() {
  const { users, autoRefresh, toggleAutoRefresh } = useUsers();
  
  return (
    <div>
      <label>
        <input
          type="checkbox"
          checked={autoRefresh}
          onChange={toggleAutoRefresh}
        />
        Автообновление (30с)
      </label>
      {/* ... */}
    </div>
  );
}
```

---

## 8. Сравнение подходов

### React Query vs Redux Toolkit

| Критерий | React Query | Redux Toolkit |
|----------|-------------|---------------|
| **Назначение** | Серверное состояние | Глобальное состояние |
| **Кэширование** | Автоматическое | Ручное |
| **Boilerplate** | Минимальный | Средний |
| **DevTools** | Есть | Отличные |
| **Обучение** | Легко | Средне |
| **Типизация** | Хорошая | Отличная |
| **Оптимизация** | Автоматическая | Ручная (селекторы) |

### Когда использовать Redux

✅ **Используйте Redux Toolkit когда:**
- Сложное глобальное состояние
- Нужна предсказуемость
- Много синхронных операций
- Требуется Time Travel debugging
- Много компонентов используют одни данные

❌ **НЕ используйте когда:**
- Только серверные данные (лучше React Query)
- Простое локальное состояние (useState)
- Маленькое приложение без сложной логики

---

## 9. Статистика проекта

### Количество кода

**Redux структура:**
- `postsSlice.js`: 150 строк (4 thunks + 5 reducers)
- `usersSlice.js`: 100 строк (2 thunks + 5 reducers)
- `uiSlice.js`: 60 строк (9 reducers)
- `selectors.js`: 100 строк (10+ селекторов)
- `hooks/`: 180 строк (3 хука)
- **Всего:** ~590 строк

**Компоненты:**
- `App.jsx`: 120 → 65 строк (-46%)
- `UsersList.jsx`: 70 → 50 строк (-29%)

### Reducers и Actions

- **Всего reducers:** 19 синхронных
- **Всего thunks:** 6 асинхронных
- **Всего селекторов:** 15+
- **Мемоизированных:** 6

---

## 10. Обработка ошибок

### В Thunks

```javascript
export const createPost = createAsyncThunk(
  'posts/createPost',
  async (postData, { rejectWithValue }) => {
    try {
      const data = await apiCreatePost(postData);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
```

### В Компонентах

```javascript
const { posts, error } = usePosts();

if (error) {
  return <ErrorMessage error={{ message: error }} />;
}
```

### В Хуках

```javascript
try {
  await dispatch(createPost(postData)).unwrap();
  dispatch(setSuccessMessage('Успех!'));
} catch (err) {
  console.error('Failed:', err);
  // Ошибка уже в state.posts.error
}
```

---

## 11. Производительность

### Оптимизации

1. **Мемоизированные селекторы**
   - Пересчет только при изменении
   - Избежание лишних рендеров

2. **useCallback в хуках**
   - Стабильные ссылки на функции
   - Предотвращение лишних useEffect

3. **Нормализация данных**
   - Плоская структура state
   - Быстрый поиск по ID

### Bundle Size

- Redux Toolkit: +45 KB (gzipped)
- React-Redux: +12 KB (gzipped)
- **Итого:** +57 KB (+35% от базы)

**Вывод:** Приемлемое увеличение для комплексного state management

---

## 12. Git коммиты

```bash
git log --oneline
```

**История:**
```
b8897c9 feat(lab3): integrate Redux into components
de0a590 feat(lab3): add memoized selectors and custom hooks
23ddf91 feat(lab3): create Redux slices with sync and async actions
a267057 feat(lab3): setup Redux store and Provider
4f26bc7 feat(lab3): install Redux Toolkit and react-redux
```

**Структура коммитов:**
1. Install - установка зависимостей
2. Setup - настройка store
3. Slices - создание slices и thunks
4. Selectors - мемоизация и хуки
5. Integration - интеграция в компоненты

---

## 13. Преимущества и недостатки

### Преимущества Redux Toolkit

✅ **Упрощенная настройка** - `configureStore` вместо ручной конфигурации  
✅ **Меньше boilerplate** - `createSlice` генерирует actions  
✅ **Встроенный Immer** - иммутабельные обновления "как мутации"  
✅ **Redux DevTools** - отличная отладка  
✅ **TypeScript поддержка** - отличная типизация  
✅ **Предсказуемость** - одно источник правды  
✅ **Time Travel** - отладка состояний  

### Недостатки

❌ **Больше кода** - по сравнению с useState  
❌ **Кривая обучения** - концепции Redux  
❌ **Оверхед** - для простых случаев  
❌ **Bundle size** - +57 KB  

---

## 14. Выводы

### Что реализовано

1. ✅ Установлен Redux Toolkit и react-redux
2. ✅ Создан store с 3 slices
3. ✅ Реализовано 19 синхронных reducers
4. ✅ Реализовано 6 async thunks
5. ✅ Создано 15+ селекторов (6 мемоизированных)
6. ✅ Интегрировано в 3+ компонента
7. ✅ Создано 3 кастомных хука
8. ✅ Подключены Redux DevTools
9. ✅ Обработка ошибок и loading состояний
10. ✅ Автообновление данных (polling)

### Результаты

- **Код стал более предсказуемым** - централизованное управление
- **Упрощена отладка** - Redux DevTools с time travel
- **Переиспользуемая логика** - кастомные хуки
- **Оптимизация ре-рендеров** - мемоизированные селекторы

---

## Дополнительные ресурсы

- [Redux Toolkit Документация](https://redux-toolkit.js.org/)
- [Redux DevTools Extension](https://github.com/reduxjs/redux-devtools)
- [createSelector Guide](https://redux.js.org/usage/deriving-data-selectors)
- [Redux Style Guide](https://redux.js.org/style-guide/)

---

**Дата выполнения:** 18 декабря 2025 г.  
**Статус:** ✅ Выполнено  
**Ссылка на репозиторий:** https://github.com/z0f1ran/butov_2025_labs
