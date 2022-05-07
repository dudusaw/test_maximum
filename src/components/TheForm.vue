<template>
  <div>
    <div style="margin-bottom: 16px; font-weight: 900; font-size: 1.5rem">
      Форма подачи заявки в отдел сервиса и качества
    </div>
    <form
      ref="formRef"
      class="form-box"
      method="post"
      action="https://624d935653326d0cfe4f0ab4.mockapi.io/api/v1/send-form"
    >
      <div class="form-group-item" required>
        <p>Ваш филиал <span style="color: red">*</span></p>
        <select name="city" class="form-select" :disabled="onlineCheck">
          <option value="" selected>Выберите город</option>
          <option
            v-for="option in cityList"
            :key="option.id"
            :value="option.id"
          >
            {{ option.title }}
          </option>
        </select>
        <div class="center-row">
          <input
            name="online"
            type="checkbox"
            class="form-check"
            id="form-check-online"
            v-model="onlineCheck"
          />
          <label for="form-check-online">Онлайн</label>
        </div>
      </div>
      <div class="form-group-item" required>
        <p>Тема обращения <span style="color: red">*</span></p>
        <div v-for="radio in radioButtons" class="center-row my">
          <input
            ref="radioButtonsRefs"
            type="radio"
            :id="'appealSubject' + radio.value"
            name="appeal"
            :value="radio.value"
            class="form-radio"
            @change="appealSubjectInputText = ''"
          />
          <label :for="'appealSubject' + radio.value">{{ radio.title }}</label>
        </div>
        <input
          v-model="appealSubjectInputText"
          name="appealSubjectText"
          type="text"
          placeholder="Другое"
          class="form-text"
          @input="uncheckRadios"
        />
      </div>
      <div class="form-group-item" required>
        <p>Описание проблемы <span style="color: red">*</span></p>
        <textarea
          name="problemDescription"
          class="form-textarea"
          rows="10"
        ></textarea>
      </div>
      <div class="form-group-item">
        <p>Загрузка документов</p>
        <p style="font-size: 0.8rem; color: #999999">
          Приложите, пожалйута полноэкранный скриншот.<br />
          Это поможет быстрее решить проблему.
        </p>
        <input type="file" name="file" />
      </div>
      <div class="form-group-item">
        <button
          type="button"
          class="form-submit"
          @click="submitClick"
          :disabled="!requiredFieldsSet"
        >
          ОТПРАВИТЬ
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";

const cityList = ref<{ id: number; title: string }[]>([]);
const onlineCheck = ref(false);
const formRef = ref<InstanceType<typeof HTMLFormElement>>();
const radioButtons = ref([
  {
    title: "Недоволен качеством услуг",
    value: 1,
  },
  {
    title: "Расторжение договора",
    value: 2,
  },
  {
    title: "Не приходит письмо активации на почту",
    value: 3,
  },
  {
    title: "Не работает личный кабинет",
    value: 4,
  },
]);
const radioButtonsRefs = ref([]);
const appealSubjectInputText = ref("");
const router = useRouter();
const requiredFieldsSet = ref(false);

const listenOnChange = () => {
  for (const item of Array.from(
    document.querySelectorAll(".form-box .form-group-item[required]")
  )) {
    item.addEventListener("change", () => {
      requiredFieldsSet.value = validateRequiredFields();
    });
  }
};
onMounted(() => listenOnChange());

/**
 * Returns true if all required field groups are set inside form-box.
 * Required field is tag with 'form-group-item' class and [required] attribute.
 * If one of all inputs inside a group is set, then it returns true for that group.
 */
const validateRequiredFields = () => {
  function validateForItem(elem: Element) {
    for (const el of Array.from(
      elem.querySelectorAll("input, select, textarea")
    )) {
      if (
        el instanceof HTMLInputElement &&
        (el.type === "checkbox" || el.type === "radio")
      ) {
        if (el.checked) {
          return true; // this for checkbox and radio
        }
      } else if ((el as any).value.length > 0) {
        return true; // this for text inputs and select
      }
    }
    return false; // return false when there's all the fields unset
  }

  for (const item of Array.from(
    document.querySelectorAll(".form-box .form-group-item[required]")
  )) {
    if (!validateForItem(item)) {
      return false;
    }
  }

  return true; // return true if there's no false validations
};

const uncheckRadios = () => {
  radioButtonsRefs.value.forEach((el) => {
    (el as HTMLInputElement).checked = false;
  });
};

const submitClick = () => {
  if (validateRequiredFields() && formRef.value) {
    const data = new FormData(formRef.value);
    axios.post(formRef.value.action, data).then((res) => {
      if (res.data.success) {
        onRequestSuccess();
      } else {
        onRequestFail();
      }
    });
  }
};

const onRequestSuccess = () => {
  router.push("success");
};

const onRequestFail = () => {
  alert("Ошибка отправки заявки");
};

axios
  .get("https://624d935653326d0cfe4f0ab4.mockapi.io/api/v1/cities")
  .then((res) => (cityList.value = res.data));
</script>

<style scoped>
.form-box {
  --border-color: rgb(206, 206, 206);
  border: 1px solid var(--border-color);
  border-radius: 4px;
  padding: 32px;
}

.form-select {
  border-radius: 2px;
  padding: 8px;
  width: 300px;
  border-color: var(--border-color);
  background-color: rgb(238, 238, 238);
  margin-bottom: 8px;
  color: rgb(107, 107, 107);
  outline: none;
}

.form-radio {
  width: 20px;
  height: 20px;
  margin-right: 12px;
}

p {
  margin: 6px 0;
}

.form-check {
  margin: 8px 0;
  width: 20px;
  height: 20px;
  margin-right: 8px;
}

.form-submit {
  outline: none;
  padding: 12px 16px;
  border: none;
  background-color: #ff8739c2;
  color: white;
  border-radius: 2px;
  cursor: pointer;
}

.form-submit:hover:not([disabled]) {
  background-color: #ffa467c2;
}

.form-submit[disabled] {
  cursor: not-allowed;
  opacity: 0.6;
}

.form-textarea {
  border: 1px solid var(--border-color);
  outline: none;
  width: 100%;
  padding: 8px;
}

.center-row {
  display: flex;
  align-items: center;
}

.form-text {
  padding: 8px;
  border: 1px solid var(--border-color);
  outline: none;
}

.form-group-item {
  margin-bottom: 32px;
}

.my {
  margin-top: 12px;
  margin-bottom: 12px;
}
</style>
