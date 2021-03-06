import matplotlib.pyplot as plt
import numpy as np
import librosa
import librosa.display
import Constants as const


def DisplaySpectrogram(filename, log_spectrogram, sr, hop_length):
    librosa.display.specshow(
        log_spectrogram,
        sr=sr,
        hop_length=hop_length
    )
    plt.savefig(f'{filename}.png', format='png')
    plt.close()


def STFT(signal, hop_length, n_samples):
    return librosa.core.stft(
        signal,
        hop_length=hop_length,
        n_fft=n_samples)


# perform stft for covid negative example
log_spectrogram = librosa.amplitude_to_db(
    np.abs(
        STFT(
            const.COVID_NEG_SIGNAL,
            const.HOP_LENGTH,
            const.N_SAMPLES_PER_FFT
        )
    )
)

DisplaySpectrogram(
    'covid-neg',
    log_spectrogram,
    const.COVID_NEG_SR,
    const.HOP_LENGTH
)


# perform stft for covid positive example
log_spectrogram = librosa.amplitude_to_db(
    np.abs(
        STFT(
            const.COVID_POS_SIGNAL,
            const.HOP_LENGTH,
            const.N_SAMPLES_PER_FFT
        )
    )
)

DisplaySpectrogram(
    'covid-pos',
    log_spectrogram,
    const.COVID_POS_SR,
    const.HOP_LENGTH
)
